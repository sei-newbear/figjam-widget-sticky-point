import { Tag } from '../types';

/**
 * WidgetNodeからTagオブジェクトを生成します。
 * @param widget - テンプレートとして使用するWidgetNode。
 * @returns 生成されたTagオブジェクト。
 */
export const createTagFromWidget = (widget: WidgetNode): Tag => {
  const point = (widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number')
                  ? widget.widgetSyncedState.point
                  : 0;

  return {
    id: `tag-${widget.id}-${Date.now()}`,
    label: "Point",
    templateWidgetId: widget.id,
    point: point,
    backgroundColor: widget.widgetSyncedState.backgroundColor as string,
    textColor: widget.widgetSyncedState.textColor as string,
  };
};

/**
 * 登録候補のウィジェットリストから、新規に登録すべきウィジェットをフィルタリングします。
 * @param widgetsToRegister - 登録候補のWidgetNodeの配列。
 * @param existingTags - 既に存在するTagの配列。
 * @returns 新規登録対象のウィジェット配列と、既に登録済みだったウィジェットの数。
 */
export const filterNewWidgets = (
  widgetsToRegister: readonly WidgetNode[],
  existingTags: readonly Tag[]
): { newWidgets: WidgetNode[], alreadyRegisteredCount: number } => {
  const existingTemplateIds = new Set(existingTags.map(tag => tag.templateWidgetId));
  const newWidgets: WidgetNode[] = [];
  let alreadyRegisteredCount = 0;

  for (const widget of widgetsToRegister) {
    if (existingTemplateIds.has(widget.id)) {
      alreadyRegisteredCount++;
    } else {
      newWidgets.push(widget);
    }
  }

  return { newWidgets, alreadyRegisteredCount };
};
