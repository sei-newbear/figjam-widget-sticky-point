// widget-src/utils.test.ts
import { getPointWidgetsFromSceneNodes } from '../../widget-src/utils/pointWidget';

describe('getPointWidgetsFromSceneNodes', () => {
  // テストの前にfigma.widgetIdをこのテストケース用に設定
  beforeAll(() => {
    (global as any).figma.widgetId = 'test-widget-id';
  });

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

    // 結果を検証
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
