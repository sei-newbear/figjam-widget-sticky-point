
const { widget } = figma
const { useSyncedState, useWidgetNodeId } = widget
import { CountTarget } from '../types'
import { getPointWidgetsFromSceneNodes } from '../utils/pointWidget'
import { calculatePoints } from '../logic/calculation'

export function useCounterWidget(countTarget: CountTarget) {
  const [total, setTotal] = useSyncedState('total', 0)
  const [pointCounts, setPointCounts] = useSyncedState<{ [point: number]: number }>('pointCounts', {})
  const [showDetails, setShowDetails] = useSyncedState('showDetails', false)
  const [selectionInfo, setSelectionInfo] = useSyncedState('selectionInfo', 'Not selected')
  const widgetId = useWidgetNodeId()

  const calculateTotal = async () => {
    let selection: readonly SceneNode[]
    const widgetNode = await figma.getNodeByIdAsync(widgetId)

    if (countTarget === 'section') {
      if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
        selection = [widgetNode.parent]
        setSelectionInfo(`Section: ${widgetNode.parent.name}`)
      } else {
        figma.notify('This widget is not in a section.')
        return
      }
    } else {
      selection = figma.currentPage.selection
      // 選択がない場合、またはカウンターウィジェット自身のみが選択されている場合
      if (selection.length === 0 || (selection.length === 1 && selection[0].id === widgetId)) {
        if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
          selection = [widgetNode.parent]
          setSelectionInfo(`Section: ${widgetNode.parent.name}`)
        } else {
          setSelectionInfo('Not selected')
        }
      } else if (selection.length === 1 && selection[0].type === 'SECTION') {
        setSelectionInfo(`Section: ${selection[0].name}`)
      } else if (selection.length > 0) {
        setSelectionInfo('Selected Multiple')
      }
    }

    const pointWidgets: WidgetNode[] = getPointWidgetsFromSceneNodes(selection);

    if (pointWidgets.length === 0) {
      setTotal(0)
      setPointCounts({})
      figma.notify('No point widgets found in the selection or parent section.')
      return
    }

    // 切り出した関数を呼び出す
    const { total, pointCounts } = calculatePoints(pointWidgets)
    setTotal(total)
    setPointCounts(pointCounts)
  }

  return { total, pointCounts, showDetails, selectionInfo, setShowDetails, calculateTotal }
}
