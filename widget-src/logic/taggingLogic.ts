import { PointTemplate, Size } from '../types';

/**
 * WidgetNodeからPointTemplateオブジェクトを生成します。
 * @param widget - テンプレートとして使用するWidgetNode。
 * @returns 生成されたPointTemplateオブジェクト。
 */
export const createPointTemplateFromWidget = (widget: WidgetNode): PointTemplate => {
  const point = (widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number')
                  ? widget.widgetSyncedState.point
                  : 0;

  const template = {
    id: `template-${widget.id}-${Date.now()}`,
    label: widget.widgetSyncedState.label as string || "Point",
    point: point,
    backgroundColor: widget.widgetSyncedState.backgroundColor as string,
    textColor: widget.widgetSyncedState.textColor as string,
    size: widget.widgetSyncedState.size as Size || 'small',
    groupingEnabled: widget.widgetSyncedState.groupingEnabled as boolean || false,
    width: widget.widgetSyncedState.width as number,
  };

  return template;
};

/**
 * 登録候補のウィジェットリストから、新規に登録すべきテンプレートをフィルタリングします。
 * @param widgetsToRegister - 登録候補のWidgetNodeの配列。
 * @param existingTemplates - 既に存在するPointTemplateの配列。
 * @returns 新規登録対象のウィジェット配列と、既に登録済みだったウィジェットの数。
 */
export const filterNewTemplates = (
  widgetsToRegister: readonly WidgetNode[],
  existingTemplates: readonly PointTemplate[]
): { newWidgets: WidgetNode[], alreadyRegisteredCount: number } => {
  const newWidgets: WidgetNode[] = [];
  let alreadyRegisteredCount = 0;

  for (const widget of widgetsToRegister) {
    const isAlreadyRegistered = existingTemplates.some(template => {
      return (
        template.label === (widget.widgetSyncedState.label as string || "Point") &&
        template.point === ((widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number') ? widget.widgetSyncedState.point : 0) &&
        template.backgroundColor === (widget.widgetSyncedState.backgroundColor as string) &&
        template.textColor === (widget.widgetSyncedState.textColor as string) &&
        template.size === (widget.widgetSyncedState.size as Size || 'small') &&
        template.groupingEnabled === (widget.widgetSyncedState.groupingEnabled as boolean || false) &&
        template.width === (widget.widgetSyncedState.width as number)
      );
    });

    if (isAlreadyRegistered) {
      alreadyRegisteredCount++;
    } else {
      newWidgets.push(widget);
    }
  }

  return { newWidgets, alreadyRegisteredCount };
};
