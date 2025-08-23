// widget-src/utils.test.ts
import { 
  getPointWidgetsFromSceneNodes,
  applyPointWidgetToStickies,
  deletePointWidgets
} from '../../widget-src/utils/pointWidget';
import { PointTemplate } from '../../widget-src/types';

// --- 共通セットアップ ---
describe('PointWidget Utils', () => {
  beforeAll(() => {
    // グローバルなfigmaオブジェクトのプロパティをテストに合わせて設定
    (global as any).figma.widgetId = 'test-widget-id';
  });

  beforeEach(() => {
    // 各テストの前にモックをクリア
    (global as any).figma.getNodeByIdAsync.mockClear();
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
    let mockStickyTagger: any;
    let mockTemplate: PointTemplate;
    let mockStickyNote1: any;
    let mockStickyNote2: any;
    let mockExistingPointWidget: any;
    let appendChildMock: jest.Mock;
  
    beforeEach(() => {
      appendChildMock = jest.fn();
      const cloneMock = jest.fn(function(this: any) {
        return { ...this, id: `cloned-${this.id}`, x: 0, y: 0 };
      });
      
      mockStickyTagger = {
        id: 'sticky-tagger-1',
        type: 'WIDGET',
        cloneWidget: cloneMock,
      };

      (global as any).figma.getNodeByIdAsync.mockResolvedValue(mockStickyTagger);

      mockTemplate = {
        id: 'template-1',
        label: 'Test',
        point: 5,
        size: 'small',
        backgroundColor: '#FFF',
        textColor: '#000',
        groupingEnabled: false,
        inputWidth: 70,
        layoutWidth: 82, // 70 + 2 * 6 (padding)
        layoutHeight: 30, // 16 + 2 * 6 + 2 (fontSize + padding + stroke)
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
  
    it('should apply widget to a sticky note and calculate position correctly', async () => {
      const stickyNotes = [mockStickyNote1];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockStickyTagger.id, mockTemplate, stickyNotes);
  
      expect(appliedCount).toBe(1);
      expect(skippedCount).toBe(0);
      expect(figma.getNodeByIdAsync).toHaveBeenCalledWith(mockStickyTagger.id);
      expect(mockStickyTagger.cloneWidget).toHaveBeenCalledTimes(1);
      expect(appendChildMock).toHaveBeenCalledTimes(1);
      
      const newWidget = appendChildMock.mock.calls[0][0];
      // x: 100 + 200 - 82 - 5 = 213
      // y: 100 + 150 - 30 - 5 = 215
      expect(newWidget.x).toBe(213);
      expect(newWidget.y).toBe(215);
    });
  
    it('should skip a sticky note that already has a point widget', async () => {
      const stickyNotes = [mockStickyNote2];
      const { appliedCount, skippedCount } = await applyPointWidgetToStickies(mockStickyTagger.id, mockTemplate, stickyNotes);
  
      expect(appliedCount).toBe(0);
      expect(skippedCount).toBe(1);
      expect(mockStickyTagger.cloneWidget).not.toHaveBeenCalled();
    });
  });

  // --- deletePointWidgets のテスト ---
  describe('deletePointWidgets', () => {
    let widget1: any;
    let widget2: any;
  
    beforeEach(() => {
      widget1 = { id: 'widget-1', removed: false, remove: jest.fn() };
      widget2 = { id: 'widget-2', removed: false, remove: jest.fn() };
    });
  
    it('should delete widgets', () => {
      const widgetsToDelete = [widget1, widget2];
      const deleteCount = deletePointWidgets(widgetsToDelete);
  
      expect(deleteCount).toBe(2);
      expect(widget1.remove).toHaveBeenCalledTimes(1);
      expect(widget2.remove).toHaveBeenCalledTimes(1);
    });
  
    it('should not try to remove an already removed widget', () => {
      widget1.removed = true;
      const widgetsToDelete = [widget1];
      const deleteCount = deletePointWidgets(widgetsToDelete);
  
      expect(deleteCount).toBe(0);
      expect(widget1.remove).not.toHaveBeenCalled();
    });
  });
});