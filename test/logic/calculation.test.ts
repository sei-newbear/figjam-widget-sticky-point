
import { calculatePoints } from '../../widget-src/logic/calculation';

describe('calculatePoints', () => {
  // WidgetNodeの型を模倣したモックオブジェクトを作成
  const createMockWidgetNode = (point: number | undefined): any => ({
    widgetSyncedState: { point },
  });

  it('should return total 0 and empty pointCounts for an empty array', () => {
    const result = calculatePoints([]);
    expect(result.total).toBe(0);
    expect(result.pointCounts).toEqual({});
  });

  it('should correctly calculate total and pointCounts', () => {
    const mockWidgets = [
      createMockWidgetNode(5),
      createMockWidgetNode(3),
      createMockWidgetNode(5),
      createMockWidgetNode(8),
      createMockWidgetNode(3),
      createMockWidgetNode(3),
    ];
    const result = calculatePoints(mockWidgets);
    expect(result.total).toBe(27);
    expect(result.pointCounts).toEqual({ 5: 2, 3: 3, 8: 1 });
  });

  it('should treat widgets with undefined or non-numeric points as 0', () => {
    const mockWidgets = [
      createMockWidgetNode(5),
      createMockWidgetNode(undefined),
      createMockWidgetNode(3),
      createMockWidgetNode(null as any), // 非数値
    ];
    const result = calculatePoints(mockWidgets);
    expect(result.total).toBe(8);
    expect(result.pointCounts).toEqual({ 5: 1, 3: 1, 0: 2 });
  });

  it('should handle floating point numbers correctly', () => {
    const mockWidgets = [
      createMockWidgetNode(0.5),
      createMockWidgetNode(1.5),
      createMockWidgetNode(0.5),
    ];
    const result = calculatePoints(mockWidgets);
    expect(result.total).toBe(2.5);
    expect(result.pointCounts).toEqual({ 0.5: 2, 1.5: 1 });
  });
});
