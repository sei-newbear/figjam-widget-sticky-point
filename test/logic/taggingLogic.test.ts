import { createPointTemplateFromWidget, filterNewTemplates } from '../../widget-src/logic/taggingLogic';
import { PointTemplate } from '../../widget-src/types';

// テストを簡略化するため、WidgetNodeの必要なプロパティのみをモック化します
const createMockWidgetNode = (id: string, props: Partial<PointTemplate & { widgetSyncedState: any, width: number, height: number }>): WidgetNode => ({
  id,
  type: 'WIDGET',
  width: props.layoutWidth || 100,
  height: props.layoutHeight || 50,
  widgetSyncedState: {
    point: props.point,
    backgroundColor: props.backgroundColor,
    textColor: props.textColor,
    size: props.size || 'small',
    groupingEnabled: props.groupingEnabled || false,
    width: props.inputWidth || 72,
    ...props.widgetSyncedState,
  },
} as any);

describe('taggingLogic', () => {
  describe('createPointTemplateFromWidget', () => {
    it('should create a template from a widget node with complete data', () => {
      const widget = createMockWidgetNode('widget-1', { 
        point: 10, 
        backgroundColor: '#FF0000', 
        textColor: '#FFFFFF', 
        size: 'medium', 
        groupingEnabled: true, 
        inputWidth: 80, 
        layoutWidth: 120, 
        layoutHeight: 60 
      });
      const template = createPointTemplateFromWidget(widget);
      expect(template.label).toBe('Point');
      expect(template.point).toBe(10);
      expect(template.backgroundColor).toBe('#FF0000');
      expect(template.textColor).toBe('#FFFFFF');
      expect(template.size).toBe('medium');
      expect(template.groupingEnabled).toBe(true);
      expect(template.inputWidth).toBe(80);
      expect(template.layoutWidth).toBe(120);
      expect(template.layoutHeight).toBe(60);
      expect(template.id).toMatch(/^template-widget-1-/);
    });

    it('should create a template with point 0 if point is not defined', () => {
      const widget = createMockWidgetNode('widget-2', {});
      const template = createPointTemplateFromWidget(widget);
      expect(template.point).toBe(0);
    });
  });

  describe('filterNewTemplates', () => {
    const existingTemplates: PointTemplate[] = [
      { id: 'tag-1', label: 'Point', point: 1, backgroundColor: '#000', textColor: '#FFF', size: 'small', groupingEnabled: false, inputWidth: 72, layoutWidth: 100, layoutHeight: 50 },
      { id: 'tag-2', label: 'Point', point: 2, backgroundColor: '#111', textColor: '#EEE', size: 'medium', groupingEnabled: true, inputWidth: 80, layoutWidth: 120, layoutHeight: 60 },
    ];

    it('should return only widgets that are not already registered', () => {
      const widgetsToRegister = [
        createMockWidgetNode('widget-2', { point: 2, backgroundColor: '#111', textColor: '#EEE', size: 'medium', groupingEnabled: true, inputWidth: 80, layoutWidth: 120, layoutHeight: 60 }), // 既存
        createMockWidgetNode('widget-3', { point: 3 }), // 新規
      ];
      const { newWidgets, alreadyRegisteredCount } = filterNewTemplates(widgetsToRegister, existingTemplates);
      expect(newWidgets.length).toBe(1);
      expect(newWidgets[0].id).toBe('widget-3');
      expect(alreadyRegisteredCount).toBe(1);
    });

    it('should handle duplicates within the registration list', () => {
      const widgetsToRegister = [
        createMockWidgetNode('widget-4', { point: 4 }), // 新規1
        createMockWidgetNode('widget-5', { point: 5 }), // 新規2
        createMockWidgetNode('widget-6', { point: 4 }), // 新規1の重複
      ];
      const { newWidgets, alreadyRegisteredCount } = filterNewTemplates(widgetsToRegister, existingTemplates);
      expect(newWidgets.length).toBe(2);
      expect(newWidgets[0].id).toBe('widget-4');
      expect(newWidgets[1].id).toBe('widget-5');
      expect(alreadyRegisteredCount).toBe(1);
    });
  });
});
