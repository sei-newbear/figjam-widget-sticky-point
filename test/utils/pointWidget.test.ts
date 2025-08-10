// widget-src/utils.test.ts
import { 
  getPointWidgetsFromSceneNodes,
  applyPointWidgetToStickies,
  deletePointWidgets
} from '../../widget-src/utils/pointWidget';

// --- 共通セットアップ ---
describe('PointWidget Utils', () => {
  beforeAll(() => {
    // グローバルなfigmaオブジェクトをモックし、テストに必要なプロパティを設定します
    (global as any).figma = {
      widgetId: 'test-widget-id',
    };
  });

  // --- getPointWidgetsFromSceneNodes のテスト ---
  describe('getPointWidgetsFromSceneNodes', () => {
    it('should return only point widgets from a list of scene nodes', () => {
      const mockNodes: any[] = [
        { id: '1', type: 'WIDGET', widgetId: 'test-widget-id', widgetSyncedState: { widgetType: 'point' } },
        { id: '2', type: 'WIDGET', widgetId: 'another-widget-id', widgetSyncedState: { widgetType: 'point' } }, // 違うウィジェットID
        {
          id: '3',
          type: 'FRAME',
          children: [
            { id: '4', type: 'WIDGET', widgetId: 'test-widget-id', widgetSyncedState: { widgetType: 'point' } },
          ],
        },
        { id: '5', type: 'WIDGET', widgetId: 'test-widget-id', widgetSyncedState: { widgetType: 'counter' } }, // ポイントウィジェットではない
        { id: '6', type: 'RECTANGLE' },
      ];
  
      const result = getPointWidgetsFromSceneNodes(mockNodes);
  
      expect(result.length).toBe(2);
      const resultIds = result.map(widget => widget.id);
      expect(resultIds).toContain('1');
      expect(resultIds).toContain('4');
    });
  
    it('should return an empty array if no point widgets are found', () => {
      const mockNodes: any[] = [
        { id: '2', type: 'WIDGET', widgetId: 'another-widget-id' },
        { id: '5', type: 'WIDGET', widgetId: 'test-widget-id', widgetSyncedState: { widgetType: 'counter' } },
        { id: '6', type: 'RECTANGLE' },
      ];
  
      const result = getPointWidgetsFromSceneNodes(mockNodes);
      expect(result.length).toBe(0);
    });
  });

  // --- applyPointWidgetToStickies のテスト ---
  describe('applyPointWidgetToStickies', () => {
    let mockTemplateWidget: any;
    let mockStickyNote1: any;
    let mockStickyNote2: any;
    let mockExistingPointWidget: any;
    let appendChildMock: jest.Mock;
  
    beforeEach(() => {
      appendChildMock = jest.fn();
      const cloneMock = jest.fn(function(this: any) {
        // clone()が呼ばれたら、新しいIDを持つ別のオブジェクトを返します
        return { ...this, id: `cloned-${this.id}`, x: 0, y: 0 };
      });
      
      mockTemplateWidget = {
        id: 'template-1',
        type: 'WIDGET',
        widgetId: 'test-widget-id',
        width: 50,
        height: 50,
        clone: cloneMock,
        widgetSyncedState: { widgetType: 'point' },
      };
  
      mockExistingPointWidget = {
        id: 'existing-point-1',
        type: 'WIDGET',
        widgetId: 'test-widget-id',
        widgetSyncedState: { widgetType: 'point' },
      };
  
      mockStickyNote1 = {
        id: 'sticky-1',
        type: 'STICKY',
        x: 100,
        y: 100,
        width: 200,
        height: 150,
        stuckNodes: [],
        parent: { appendChild: appendChildMock },
      };
      
      mockStickyNote2 = {
        id: 'sticky-2',
        type: 'STICKY',
        x: 400,
        y: 400,
        width: 200,
        height: 150,
        stuckNodes: [mockExistingPointWidget], // 既にウィジェットが存在
        parent: { appendChild: appendChildMock },
      };
    });
  
    it('should apply widget to a sticky note without one and calculate position correctly', async () => {
      const stickyNotes = [mockStickyNote1];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockTemplateWidget, stickyNotes);
  
      expect(appliedCount).toBe(1);
      expect(skippedCount).toBe(0);
      expect(mockTemplateWidget.clone).toHaveBeenCalledTimes(1);
      expect(appendChildMock).toHaveBeenCalledTimes(1);
      
      const newWidget = appendChildMock.mock.calls[0][0];
      expect(newWidget.id).toBe('cloned-template-1');
      // x: 100 + 200 - 50 - 5 = 245
      // y: 100 + 150 - 50 - 5 = 195
      expect(newWidget.x).toBe(245);
      expect(newWidget.y).toBe(195);
    });
  
    it('should skip a sticky note that already has a point widget', async () => {
      const stickyNotes = [mockStickyNote2];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockTemplateWidget, stickyNotes);
  
      expect(appliedCount).toBe(0);
      expect(skippedCount).toBe(1);
      expect(mockTemplateWidget.clone).not.toHaveBeenCalled();
      expect(appendChildMock).not.toHaveBeenCalled();
    });
  
    it('should handle a mix of applicable and skipped notes', async () => {
      const stickyNotes = [mockStickyNote1, mockStickyNote2];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockTemplateWidget, stickyNotes);
  
      expect(appliedCount).toBe(1);
      expect(skippedCount).toBe(1);
      expect(mockTemplateWidget.clone).toHaveBeenCalledTimes(1);
      expect(appendChildMock).toHaveBeenCalledTimes(1);
    });

    it('should skip nodes that are not stickies or dont have stuckNodes property', async () => {
      const invalidNodes = [{ id: 'frame-1', type: 'FRAME' }];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockTemplateWidget, invalidNodes as any);
      
      expect(appliedCount).toBe(0);
      expect(skippedCount).toBe(0);
    });
  });

  // --- deletePointWidgets のテスト ---
  describe('deletePointWidgets', () => {
    let widget1: any;
    let widget2: any;
    let widget3_template: any;
  
    beforeEach(() => {
      widget1 = { id: 'widget-1', removed: false, remove: jest.fn() };
      widget2 = { id: 'widget-2', removed: false, remove: jest.fn() };
      widget3_template = { id: 'widget-3-template', removed: false, remove: jest.fn() };
    });
  
    it('should delete widgets that are not templates', () => {
      const widgetsToDelete = [widget1, widget2];
      const templateIds = new Set(['widget-3-template']);
      
      const { deleteCount, skippedCount } = deletePointWidgets(widgetsToDelete, templateIds);
  
      expect(deleteCount).toBe(2);
      expect(skippedCount).toBe(0);
      expect(widget1.remove).toHaveBeenCalledTimes(1);
      expect(widget2.remove).toHaveBeenCalledTimes(1);
    });
  
    it('should skip widgets that are used as templates', () => {
      const widgetsToDelete = [widget1, widget3_template];
      const templateIds = new Set(['widget-3-template']);
  
      const { deleteCount, skippedCount } = deletePointWidgets(widgetsToDelete, templateIds);
  
      expect(deleteCount).toBe(1);
      expect(skippedCount).toBe(1);
      expect(widget1.remove).toHaveBeenCalledTimes(1);
      expect(widget3_template.remove).not.toHaveBeenCalled();
    });
  
    it('should not try to remove an already removed widget', () => {
      widget1.removed = true;
      const widgetsToDelete = [widget1];
      const templateIds = new Set<string>();
  
      const { deleteCount, skippedCount } = deletePointWidgets(widgetsToDelete, templateIds);
  
      expect(deleteCount).toBe(0);
      expect(skippedCount).toBe(0);
      expect(widget1.remove).not.toHaveBeenCalled();
    });
  });
});