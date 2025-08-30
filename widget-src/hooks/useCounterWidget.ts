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
  const [lockedSectionId, setLockedSectionId] = useSyncedState<string | null>('lockedSectionId', null)
  const widgetId = useWidgetNodeId()

  const handleLockSection = async () => {
    const selection = figma.currentPage.selection
    if (selection.length === 1 && selection[0].type === 'SECTION') {
      const sectionNode = selection[0]
      setLockedSectionId(sectionNode.id)
      setSelectionInfo(`Locked on: ${sectionNode.name}`)
      figma.notify(`Locked on section: "${sectionNode.name}"`);
    } else {
      figma.notify('Please select a single section to lock on.')
    }
  }

  const calculateTotal = async () => {
    let pointWidgets: WidgetNode[] = []
    const widgetNode = await figma.getNodeByIdAsync(widgetId)

    if (countTarget === 'locked_section') {
      if (!lockedSectionId) {
        setSelectionInfo('No section locked')
        figma.notify('Please lock on a section first.')
        setTotal(0)
        setPointCounts({})
        return
      }
      const sectionNode = await figma.getNodeByIdAsync(lockedSectionId)
      if (!sectionNode || sectionNode.type !== 'SECTION') {
        setLockedSectionId(null)
        setSelectionInfo('No section locked')
        figma.notify('The locked section was not found. Please lock on a new one.')
        setTotal(0)
        setPointCounts({})
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
      setSelectionInfo(`Locked on: ${sectionNode.name}`)

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

  return { total, pointCounts, showDetails, selectionInfo, setShowDetails, calculateTotal, handleLockSection, lockedSectionId }
}