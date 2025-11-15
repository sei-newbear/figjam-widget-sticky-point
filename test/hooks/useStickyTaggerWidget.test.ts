import { useStickyTaggerWidget } from '../../widget-src/hooks/useStickyTaggerWidget';
import { PointTemplate } from '../../widget-src/types';

// applyPointWidgetToStickiesをモック化
const mockApplyPointWidgetToStickies = jest.fn();
jest.mock('../../widget-src/utils/pointWidget', () => ({
  ...jest.requireActual('../../widget-src/utils/pointWidget'),
  applyPointWidgetToStickies: (
    widgetId: string,
    template: PointTemplate,
    stickies: SceneNode[],
    options: { isOverwriteEnabled: boolean }
  ) => mockApplyPointWidgetToStickies(widgetId, template, stickies, options),
}));

describe('useStickyTaggerWidget with overwrite mode', () => {
  const { widget } = (global as any).figma;
  const mockUseSyncedState = widget.useSyncedState as jest.Mock;

  beforeEach(() => {
    // モックをリセット
    mockApplyPointWidgetToStickies.mockClear();
    ((global as any).figma.notify as jest.Mock).mockClear();
    // useSyncedStateのモック実装をリセット
    mockUseSyncedState.mockReset();

    // applyPointWidgetToStickiesが適切なオブジェクトを返すように設定
    mockApplyPointWidgetToStickies.mockResolvedValue({ appliedCount: 1, skippedCount: 0 });
  });

  const renderHookForTest = (isOverwriteEnabled: boolean) => {
    // useSyncedStateが呼ばれるたびに、指定された値を返すように設定
    const stateMocks = {
      stickyTaggerTemplates: [[], jest.fn()],
      showConfirmDelete: [false, jest.fn()],
      templateIdToDelete: [null, jest.fn()],
      showConfirmBulkDelete: [false, jest.fn()],
      widgetsToDeleteCount: [0, jest.fn()],
      widgetsToDeleteIds: [[], jest.fn()],
      stickyTaggerSizeMode: ['normal', jest.fn()],
      isOverwriteEnabled: [isOverwriteEnabled, jest.fn()], // テスト対象の状態
    };

    mockUseSyncedState.mockImplementation((key: keyof typeof stateMocks) => {
      return stateMocks[key] || [undefined, jest.fn()];
    });

    return useStickyTaggerWidget();
  };

  it('should call applyPointWidgetToStickies with isOverwriteEnabled: false when overwrite mode is off', async () => {
    const hookResult = renderHookForTest(false);
    
    const template: PointTemplate = { id: '1', point: 5, label: 'test', backgroundColor: '', textColor: '', size: 'small', groupingEnabled: false, inputWidth: 0, layoutWidth: 0, layoutHeight: 0 };
    const stickies: SceneNode[] = [{ id: 's1', type: 'STICKY', parent: { type: "PAGE" } } as any];
    (global as any).figma.currentPage.selection = stickies;

    await hookResult.handleTemplateClick(template);

    expect(mockApplyPointWidgetToStickies).toHaveBeenCalledWith(
      expect.any(String),
      template,
      stickies,
      { isOverwriteEnabled: false }
    );
  });

  it('should call applyPointWidgetToStickies with isOverwriteEnabled: true when overwrite mode is on', async () => {
    const hookResult = renderHookForTest(true);

    const template: PointTemplate = { id: '2', point: 10, label: 'test', backgroundColor: '', textColor: '', size: 'small', groupingEnabled: false, inputWidth: 0, layoutWidth: 0, layoutHeight: 0 };
    const stickies: SceneNode[] = [{ id: 's2', type: 'STICKY', parent: { type: "PAGE" } } as any];
    (global as any).figma.currentPage.selection = stickies;

    await hookResult.handleTemplateClick(template);

    expect(mockApplyPointWidgetToStickies).toHaveBeenCalledWith(
      expect.any(String),
      template,
      stickies,
      { isOverwriteEnabled: true }
    );
  });
});
