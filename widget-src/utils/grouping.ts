import { shouldGroup, shouldUngroup } from '../logic/groupingRules';

/**
 * 条件を満たす場合、ウィジェットをくっついているノードとグループ化する
 */
export function groupWidget(widgetNode: WidgetNode): void {
  if (!shouldGroup(widgetNode)) return; // widgetNode is now StuckWidgetNode

  // グループ化の親ノードを決定 (widgetNode.parent が null の場合は figma.currentPage を使用)
  const commonParent = widgetNode.parent || figma.currentPage;

  figma.group([widgetNode, widgetNode.stuckTo], commonParent);
}

/**
 * 条件を満たす場合、ウィジェットのグループを解除する
 */
export function ungroupWidget(widgetNode: WidgetNode, isForceMode: boolean = false): void {
  if (!shouldUngroup(widgetNode, isForceMode)) return;

  // shouldUngroupがtrueを返すため、widgetNode.parent は GroupNode であることが保証される
  figma.ungroup(widgetNode.parent);
}
