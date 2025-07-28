
export function getPointWidgetsFromSceneNodes(sceneNodes: readonly SceneNode[]): WidgetNode[] {
  const pointWidgetsMap = new Map<string, WidgetNode>();
  
  sceneNodes.forEach(node => {
    const widgets = getPointWidgets(node);
    widgets.forEach(widget => {
      // IDでユニークにする
      pointWidgetsMap.set(widget.id, widget);
    });
  });

  return Array.from(pointWidgetsMap.values());
}

// Stickyノートを収集する関数（再帰的に探索）
function getPointWidgets(node: SceneNode): WidgetNode[] {
  const isPointWidget = (node: SceneNode): node is WidgetNode => {
    return node.type === 'WIDGET' && node.widgetId === figma.widgetId && node.widgetSyncedState['widgetType'] === 'point'
  }

  const pointWidgets: WidgetNode[] = [];

  // Stickyノートの場合、stickies配列に追加
  if (isPointWidget(node)) {
    pointWidgets.push(node);
  }

  if ("children" in node) {
    node.children.forEach(child => {
      pointWidgets.push(...getPointWidgets(child));
    });
  }

  if ("stuckNodes" in node) {
    node.stuckNodes.forEach(stuckNode => {
      pointWidgets.push(...getPointWidgets(stuckNode));
    })
  }

  return pointWidgets;
}
