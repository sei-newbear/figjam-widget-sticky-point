
import { isOverlapping } from '../../widget-src/logic/isOverlapping';

// ヘルパー関数：指定されたジオメトリでモックNodeを作成
const createMockNode = (x: number, y: number, width: number, height: number): any => ({
  absoluteBoundingBox: { x, y, width, height },
});

// モックNode（座標情報なし）
const mockNodeWithoutBounds: any = { absoluteBoundingBox: null };

describe('isOverlapping', () => {
  // テストの基準となるセクション
  const section = createMockNode(100, 100, 200, 200); // x: 100-300, y: 100-300

  it('should return true when node is completely inside the section', () => {
    const nodeInside = createMockNode(150, 150, 50, 50);
    expect(isOverlapping(nodeInside, section)).toBe(true);
  });

  it('should return true when node partially overlaps from the right', () => {
    const nodeOverlapRight = createMockNode(250, 150, 100, 50);
    expect(isOverlapping(nodeOverlapRight, section)).toBe(true);
  });

  it('should return true when node partially overlaps from the top-left', () => {
    const nodeOverlapTopLeft = createMockNode(50, 50, 100, 100);
    expect(isOverlapping(nodeOverlapTopLeft, section)).toBe(true);
  });

  it('should return true when the section is completely inside the node', () => {
    const nodeContains = createMockNode(50, 50, 300, 300);
    expect(isOverlapping(nodeContains, section)).toBe(true);
  });

  it('should return true when edges are touching', () => {
    const nodeTouching = createMockNode(300, 100, 50, 50);
    expect(isOverlapping(nodeTouching, section)).toBe(true);
  });

  it('should return false when nodes do not overlap', () => {
    const nodeOutside = createMockNode(400, 400, 50, 50);
    expect(isOverlapping(nodeOutside, section)).toBe(false);
  });

  it('should return false if the node has no bounding box', () => {
    expect(isOverlapping(mockNodeWithoutBounds, section)).toBe(false);
  });

  it('should return false if the section has no bounding box', () => {
    const node = createMockNode(100, 100, 50, 50);
    expect(isOverlapping(node, mockNodeWithoutBounds)).toBe(false);
  });
});
