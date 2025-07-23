// test/setupTests.ts

// JestのグローバルAPIを拡張して、テスト全体で利用可能なモック関数を提供
const jestGlobal = global as any;

// Figma APIの基本的なモックをグローバルスコープに設定
// 各テストファイルで、テスト対象に応じてこのモックをさらに詳細に設定します。
jestGlobal.figma = {
  widget: {
    useSyncedState: jest.fn((key, initialValue) => [initialValue, jest.fn()]) as jest.Mock,
    useEffect: jest.fn(callback => callback()) as jest.Mock,
    useStickable: jest.fn() as jest.Mock,
    useWidgetNodeId: jest.fn(() => 'test-widget-id') as jest.Mock,

    // UIコンポーネントのモック (基本的な実装)
    AutoLayout: jest.fn(),
    Frame: jest.fn(),
    Text: jest.fn(),
    Input: jest.fn(),
    SVG: jest.fn(),
    Image: jest.fn(),
    Rectangle: jest.fn(),
    Ellipse: jest.fn(),
    Line: jest.fn(),
  },
  // Figma API関数のモック
  getNodeByIdAsync: jest.fn().mockResolvedValue(null) as jest.Mock,
  ungroup: jest.fn().mockResolvedValue(undefined) as jest.Mock,
  group: jest.fn().mockResolvedValue(null) as jest.Mock,
  notify: jest.fn() as jest.Mock,
  
  // カレントページのモック
  currentPage: {
    selection: [],
  },

  // ウィジェットID
  widgetId: 'global-test-widget-id',
};
