
const { widget } = figma
const { useSyncedState, useWidgetNodeId } = widget
import { CountTarget } from '../types'
import { getPointWidgetsFromSceneNodes } from '../utils/pointWidget'
import { calculatePoints } from '../logic/calculation'
import { isOverlapping } from '../logic/isOverlapping'

export function useCounterWidget(countTarget: CountTarget) {
  const [total, setTotal] = useSyncedState('total', 0)
  const [pointCounts, setPointCounts] = useSyncedState<{ [point: number]: number }>('pointCounts', {})
  const [showDetails, setShowDetails] = useSyncedState('showDetails', false)
  const [selectionInfo, setSelectionInfo] = useSyncedState('selectionInfo', 'Not selected')
  const [linkedSectionId, setLinkedSectionId] = useSyncedState<string | null>('linkedSectionId', null)
  const widgetId = useWidgetNodeId()

  const handleLinkSection = async () => {
    const selection = figma.currentPage.selection
    if (selection.length === 1 && selection[0].type === 'SECTION') {
      const sectionNode = selection[0]
      setLinkedSectionId(sectionNode.id)
      setSelectionInfo(`Linked to: ${sectionNode.name}`)
      figma.notify(`Linked to section: "${sectionNode.name}"`);
    } else {
      figma.notify('Please select a single section to link.')
    }
  }

  const calculateTotal = async () => {
    let pointWidgets: WidgetNode[] = []
    const widgetNode = await figma.getNodeByIdAsync(widgetId)

    if (countTarget === 'linked_section') {
      if (!linkedSectionId) {
        setSelectionInfo('No section linked')
        figma.notify('Please link a section first.')
        return
      }
      const sectionNode = await figma.getNodeByIdAsync(linkedSectionId)
      if (!sectionNode || sectionNode.type !== 'SECTION') {
        setLinkedSectionId(null)
        setSelectionInfo('No section linked')
        figma.notify('The linked section was not found. Please link a new one.')
        return
      }

      if (sectionNode.locked) {
        const allWidgets = await figma.currentPage.findAllWithCriteria({ types: ['WIDGET'] })
        const allPointWidgets = getPointWidgetsFromSceneNodes(allWidgets)
        pointWidgets = allPointWidgets.filter(widget => {
          let nodeToCheck: SceneNode = widget
          const hostNode = widget.stuckTo
          if (hostNode) {
            nodeToCheck = hostNode
          }
          return isOverlapping(nodeToCheck, sectionNode)
        })
      } else {
        pointWidgets = getPointWidgetsFromSceneNodes([sectionNode])
      }
      setSelectionInfo(`Linked to: ${sectionNode.name}`)

    } else if (countTarget === 'section') {
      if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
        pointWidgets = getPointWidgetsFromSceneNodes([widgetNode.parent])
        setSelectionInfo(`Section: ${widgetNode.parent.name}`)
      } else {
        setSelectionInfo('This widget is not in a section.')
        figma.notify('This widget is not in a section.')
        return
      }
    } else { // selection
      const selection = figma.currentPage.selection
      if (selection.length === 0 || (selection.length === 1 && selection[0].id === widgetId)) {
        if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
          pointWidgets = getPointWidgetsFromSceneNodes([widgetNode.parent])
          setSelectionInfo(`Section: ${widgetNode.parent.name}`)
        } else {
          setSelectionInfo('Not selected')
        }
      } else {
        pointWidgets = getPointWidgetsFromSceneNodes(selection)
        if (selection.length === 1 && selection[0].type === 'SECTION') {
          setSelectionInfo(`Section: ${selection[0].name}`)
        } else if (selection.length > 0) {
          setSelectionInfo('Selected Multiple')
        }
      }
    }

    if (pointWidgets.length === 0) {
      setTotal(0)
      setPointCounts({})
      figma.notify('No point widgets found.')
      return
    }

    const { total, pointCounts } = calculatePoints(pointWidgets)
    setTotal(total)
    setPointCounts(pointCounts)
  }

  return { total, pointCounts, showDetails, selectionInfo, setShowDetails, calculateTotal, handleLinkSection }
}
