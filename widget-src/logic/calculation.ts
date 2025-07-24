
// 純粋な計算ロジック
export const calculatePoints = (pointWidgets: WidgetNode[]) => {
  if (pointWidgets.length === 0) {
    return { total: 0, pointCounts: {} }
  }

  const points = pointWidgets.map(widget => {
    const point = widget.widgetSyncedState['point']
    return typeof point === 'number' ? point : 0
  })

  const total = points.reduce((acc, curr) => acc + curr, 0)

  const pointCounts = points.reduce<{ [point: number]: number }>((acc, point) => {
    acc[point] = (acc[point] || 0) + 1
    return acc
  }, {})

  return { total, pointCounts }
}
