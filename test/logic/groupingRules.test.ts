
import { shouldGroup, shouldUngroup } from '../../widget-src/logic/groupingRules';

// Mock WidgetNode
const createMockWidgetNode = (properties: any): any => ({
  id: 'widgetId',
  parent: { type: 'PAGE' },
  stuckTo: null,
  ...properties,
});

describe('groupingRules', () => {
  describe('shouldGroup', () => {
    it('should return true when the widget is stuck to a node and not in a group', () => {
      const widgetNode = createMockWidgetNode({ stuckTo: { id: 'hostId' } });
      expect(shouldGroup(widgetNode)).toBe(true);
    });

    it('should return false when the widget is already in a group', () => {
      const widgetNode = createMockWidgetNode({ parent: { type: 'GROUP' }, stuckTo: { id: 'hostId' } });
      expect(shouldGroup(widgetNode)).toBe(false);
    });

    it('should return false when the widget is not stuck to any node', () => {
      const widgetNode = createMockWidgetNode({ stuckTo: null });
      expect(shouldGroup(widgetNode)).toBe(false);
    });
  });

  describe('shouldUngroup', () => {
    it('should return true for a valid group', () => {
      const widgetNode = createMockWidgetNode({
        stuckTo: { id: 'hostId' },
        parent: {
          type: 'GROUP',
          children: [{ id: 'widgetId' }, { id: 'hostId' }],
        },
      });
      expect(shouldUngroup(widgetNode)).toBe(true);
    });

    it('should return false if not in a group', () => {
      const widgetNode = createMockWidgetNode({ parent: { type: 'PAGE' } });
      expect(shouldUngroup(widgetNode)).toBe(false);
    });

    it('should return false if the group has more than 2 children', () => {
      const widgetNode = createMockWidgetNode({
        parent: {
          type: 'GROUP',
          children: [{}, {}, {}],
        },
      });
      expect(shouldUngroup(widgetNode)).toBe(false);
    });

    it('should return true if the group has more than 2 children when isForceMode is true', () => {
      const widgetNode = createMockWidgetNode({
        parent: {
          type: 'GROUP',
          children: [{}, {}, {}],
        },
      });
      expect(shouldUngroup(widgetNode, true)).toBe(true);
    });

    it('should return true if the group has less than 2 children when isForceMode is true', () => {
      const widgetNode = createMockWidgetNode({
        parent: {
          type: 'GROUP',
          children: [{}],
        },
      });
      expect(shouldUngroup(widgetNode, true)).toBe(true);
    });

    it('should return false if not in a group even when isForceMode is true', () => {
      const widgetNode = createMockWidgetNode({ parent: { type: 'PAGE' } });
      expect(shouldUngroup(widgetNode, true)).toBe(false);
    });
  });
});
