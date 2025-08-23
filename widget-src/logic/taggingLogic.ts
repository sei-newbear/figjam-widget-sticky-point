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
    inputWidth: widget.widgetSyncedState.width as number,
    layoutWidth: widget.width,
    layoutHeight: widget.height,
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
  const addedSignatures = new Set<string>();

  for (const widget of widgetsToRegister) {
    const signature = JSON.stringify({
      label: widget.widgetSyncedState.label as string || "Point",
      point: (widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number') ? widget.widgetSyncedState.point : 0,
      backgroundColor: widget.widgetSyncedState.backgroundColor as string,
      textColor: widget.widgetSyncedState.textColor as string,
      size: widget.widgetSyncedState.size as Size || 'small',
      groupingEnabled: widget.widgetSyncedState.groupingEnabled as boolean || false,
      inputWidth: widget.widgetSyncedState.width as number,
      layoutWidth: widget.width,
      layoutHeight: widget.height,
    });

    const isAlreadyInExisting = existingTemplates.some(template => {
      const existingSignature = JSON.stringify({
        label: template.label,
        point: template.point,
        backgroundColor: template.backgroundColor,
        textColor: template.textColor,
        size: template.size,
        groupingEnabled: template.groupingEnabled,
        inputWidth: template.inputWidth,
        layoutWidth: template.layoutWidth,
        layoutHeight: template.layoutHeight,
      });
      return signature === existingSignature;
    });

    if (isAlreadyInExisting || addedSignatures.has(signature)) {
      alreadyRegisteredCount++;
    } else {
      addedSignatures.add(signature);
      newWidgets.push(widget);
    }
  }

  return { newWidgets, alreadyRegisteredCount };
};
