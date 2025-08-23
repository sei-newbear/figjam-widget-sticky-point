import { PointTemplate, Size } from '../types';
import { PointWidget } from '../components/PointWidget';

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
 * @param stickyTaggerWidgetId - クローン元のStickyTaggerWidgetのID
 * @param template - 適用するPoint Template
 * @param stickyNotes - 適用対象の付箋ノードの配列。
 * @returns 適用された数とスキップされた数。
 */
export const applyPointWidgetToStickies = async (
  stickyTaggerWidgetId: string,
  template: PointTemplate,
  stickyNotes: readonly SceneNode[]
): Promise<{ appliedCount: number; skippedCount: number }> => {
  let appliedCount = 0;
  let skippedCount = 0;

  const stickyTaggerNode = await figma.getNodeByIdAsync(stickyTaggerWidgetId);
  if (!stickyTaggerNode || stickyTaggerNode.type !== 'WIDGET') {
    figma.notify('StickyTagger widget not found.');
    return { appliedCount: 0, skippedCount: stickyNotes.length };
  }
  const stickyTagger = stickyTaggerNode as WidgetNode;

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

    const newPointWidget = stickyTagger.cloneWidget({
      widgetComponent: PointWidget,
      widgetType: 'point',
      ...template,
      width: template.inputWidth, // Map inputWidth to width prop
    });

    // 付箋の右下に配置するための座標を計算
    const INSET_OFFSET = 5; // Offset from right and bottom edges
    const widgetWidth = template.layoutWidth;
    const widgetHeight = template.layoutHeight;

    // 付箋と同じ親にクローンされたウィジェットを追加
    if (stickyNote.parent) {
      stickyNote.parent.appendChild(newPointWidget);
    }

    newPointWidget.x = stickyNote.x + stickyNote.width - widgetWidth - INSET_OFFSET;
    newPointWidget.y = stickyNote.y + stickyNote.height - widgetHeight - INSET_OFFSET;

    appliedCount++;
  }

  return { appliedCount, skippedCount };
};


/**
 * 指定されたPoint Widgetのリストを削除します。
 * @param widgetsToDelete - 削除候補のPoint Widgetの配列。
 * @returns 削除された数。
 */
export const deletePointWidgets = (
  widgetsToDelete: readonly WidgetNode[]
): { deleteCount: number; skippedCount: 0 } => {
  let deleteCount = 0;

  for (const widget of widgetsToDelete) {
    if (!widget.removed) {
      widget.remove();
      deleteCount++;
    }
  }

  return { deleteCount, skippedCount: 0 };
};
