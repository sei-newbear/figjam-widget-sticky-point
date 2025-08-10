import { createTagFromWidget, filterNewWidgets } from '../../widget-src/logic/taggingLogic';
import { Tag } from '../../widget-src/types';

// テストを簡略化するため、WidgetNodeの必要なプロパティのみをモック化します
const createMockWidgetNode = (id: string, point?: number, backgroundColor?: string, textColor?: string): WidgetNode => ({
  id,
  type: 'WIDGET',
  widgetSyncedState: {
    point,
    backgroundColor,
    textColor,
  },
} as any);


describe('taggingLogic', () => {
  describe('createTagFromWidget', () => {
    it('should create a tag from a widget node with complete data', () => {
      const widget = createMockWidgetNode('widget-1', 10, '#FF0000', '#FFFFFF');
      const tag = createTagFromWidget(widget);
      expect(tag.label).toBe('Point');
      expect(tag.templateWidgetId).toBe('widget-1');
      expect(tag.point).toBe(10);
      expect(tag.backgroundColor).toBe('#FF0000');
      expect(tag.textColor).toBe('#FFFFFF');
      // IDはDate.now()を含むため、接頭辞のみをテストします
      expect(tag.id).toMatch(/^tag-widget-1-/);
    });

    it('should create a tag with point 0 if point is not defined', () => {
      const widget = createMockWidgetNode('widget-2');
      const tag = createTagFromWidget(widget);
      expect(tag.point).toBe(0);
    });

    it('should handle missing color properties', () => {
        const widget = createMockWidgetNode('widget-3', 5);
        const tag = createTagFromWidget(widget);
        expect(tag.backgroundColor).toBeUndefined();
        expect(tag.textColor).toBeUndefined();
    });
  });

  describe('filterNewWidgets', () => {
    const existingTags: Tag[] = [
      { id: 'tag-1', templateWidgetId: 'widget-1', label: 'A', point: 1, backgroundColor: '#000', textColor: '#FFF' },
      { id: 'tag-2', templateWidgetId: 'widget-2', label: 'B', point: 2, backgroundColor: '#000', textColor: '#FFF' },
    ];

    it('should return only widgets that are not already registered', () => {
      const widgetsToRegister = [
        createMockWidgetNode('widget-2'), // 既存
        createMockWidgetNode('widget-3'), // 新規
      ];
      const { newWidgets, alreadyRegisteredCount } = filterNewWidgets(widgetsToRegister, existingTags);
      expect(newWidgets.length).toBe(1);
      expect(newWidgets[0].id).toBe('widget-3');
      expect(alreadyRegisteredCount).toBe(1);
    });

    it('should return an empty array if all widgets are already registered', () => {
        const widgetsToRegister = [
            createMockWidgetNode('widget-1'),
            createMockWidgetNode('widget-2'),
        ];
        const { newWidgets, alreadyRegisteredCount } = filterNewWidgets(widgetsToRegister, existingTags);
        expect(newWidgets.length).toBe(0);
        expect(alreadyRegisteredCount).toBe(2);
    });

    it('should return all widgets if no tags exist', () => {
        const widgetsToRegister = [
            createMockWidgetNode('widget-1'),
            createMockWidgetNode('widget-2'),
        ];
        const { newWidgets, alreadyRegisteredCount } = filterNewWidgets(widgetsToRegister, []);
        expect(newWidgets.length).toBe(2);
        expect(alreadyRegisteredCount).toBe(0);
    });

    it('should handle an empty list of widgets to register', () => {
        const { newWidgets, alreadyRegisteredCount } = filterNewWidgets([], existingTags);
        expect(newWidgets.length).toBe(0);
        expect(alreadyRegisteredCount).toBe(0);
    });
  });
});
