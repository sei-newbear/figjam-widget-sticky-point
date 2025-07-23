
const { widget } = figma
const { useSyncedState, useWidgetNodeId } = widget
import { CountTarget } from '../types'
import { getPointWidgetsFromSceneNodes } from '../utils'

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

    const points = pointWidgets.map(widget => {
      const point = widget.widgetSyncedState['point']
      if (typeof point === 'number') {
        return point
      }
      return 0
    });

    const newTotal = points.reduce((acc, curr) => acc + curr, 0)
    setTotal(newTotal)

    // ポイント値ごとに件数を集計
    const counts = points.reduce<{ [point: number]: number }>((acc, point) => {
      acc[point] = (acc[point] || 0) + 1
      return acc
    }, {})
    setPointCounts(counts)
  }

  return { total, pointCounts, showDetails, selectionInfo, setShowDetails, calculateTotal }
}
