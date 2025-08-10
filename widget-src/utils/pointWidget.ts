/**
 * 指定されたノードがこのウィジェットの「Point Widget」であるかを判定する型ガード関数。
 */
const isPointWidget = (node: SceneNode): node is WidgetNode => {
  // widgetSyncedStateの存在をチェックして、より安全なアクセスを保証します。
  return node.type === 'WIDGET' && 
         node.widgetId === figma.widgetId && 
         'widgetSyncedState' in node && 
         node.widgetSyncedState['widgetType'] === 'point';
};

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

// Point Widgetを収集する関数（再帰的に探索）
function getPointWidgets(node: SceneNode): WidgetNode[] {
  const pointWidgets: WidgetNode[] = [];

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

/**
 * 指定された付箋にテンプレートウィジェットを複製して適用します。
 * 既にウィジェットが適用されている付箋はスキップされます。
 * @param templateWidget - テンプレートとして使用するPoint Widget。
 * @param stickyNotes - 適用対象の付箋ノードの配列。
 * @returns 適用された数とスキップされた数。
 */
export const applyPointWidgetToStickies = async (
  templateWidget: WidgetNode,
  stickyNotes: readonly SceneNode[]
): Promise<{ appliedCount: number; skippedCount: number }> => {
  let appliedCount = 0;
  let skippedCount = 0;

  for (const stickyNote of stickyNotes) {
    // `stuckNodes` プロパティを持つかチェックし、型を絞り込みます
    if (!('stuckNodes' in stickyNote) || !(stickyNote.type === 'STICKY')) {
      continue;
    }

    const hasExistingPointWidget = stickyNote.stuckNodes.some(isPointWidget);

    if (hasExistingPointWidget) {
      skippedCount++;
      continue;
    }

    const clonedWidget = templateWidget.clone();

    // 付箋の右下に配置するための座標を計算
    const INSET_OFFSET = 5; // Offset from right and bottom edges
    const widgetWidth = clonedWidget.width;
    const widgetHeight = clonedWidget.height;

    clonedWidget.x = stickyNote.x + stickyNote.width - widgetWidth - INSET_OFFSET;
    clonedWidget.y = stickyNote.y + stickyNote.height - widgetHeight - INSET_OFFSET;

    // 付箋と同じ親にクローンされたウィジェットを追加
    if (stickyNote.parent) {
      stickyNote.parent.appendChild(clonedWidget);
    }
    appliedCount++;
  }

  return { appliedCount, skippedCount };
};

/**
 * 指定されたPoint Widgetのリストから、テンプレートとして使用されているものを除外して削除します。
 * @param widgetsToDelete - 削除候補のPoint Widgetの配列。
 * @param templateIds - テンプレートとして登録されているウィジェットIDのSet。
 * @returns 削除された数とスキップされた数。
 */
export const deletePointWidgets = (
  widgetsToDelete: readonly WidgetNode[],
  templateIds: Set<string>
): { deleteCount: number; skippedCount: number } => {
  let deleteCount = 0;
  let skippedCount = 0;

  for (const widget of widgetsToDelete) {
    if (templateIds.has(widget.id)) {
      skippedCount++;
      continue;
    }

    if (!widget.removed) {
      widget.remove();
      deleteCount++;
    }
  }

  return { deleteCount, skippedCount };
};
