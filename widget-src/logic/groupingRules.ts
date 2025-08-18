
type StuckWidgetNode = WidgetNode & { stuckTo: NonNullable<WidgetNode['stuckTo']> };
type GroupedWidgetNode = WidgetNode & { parent: GroupNode };

export function shouldGroup(widgetNode: WidgetNode): widgetNode is StuckWidgetNode {
  // すでにグループ化されている場合や、何にもくっついていない場合は対象外
  if (widgetNode.parent?.type === 'GROUP') {
    return false;
  }
  return !!widgetNode.stuckTo;
}

export function shouldUngroup(widgetNode: WidgetNode, isForceMode: boolean = false): widgetNode is GroupedWidgetNode {
  const parent = widgetNode.parent;
  // グループ化されていない場合は対象外
  if (parent?.type !== 'GROUP') {
    return false;
  }

  // 強制モードが有効な場合は、子要素の数のチェックをスキップ
  if (isForceMode) {
    return true;
  }

  // グループの子要素が2つでない場合（意図しないグループ化）は解除しない
  if (parent.children.length !== 2) {
    return false;
  }

  return true;
}
