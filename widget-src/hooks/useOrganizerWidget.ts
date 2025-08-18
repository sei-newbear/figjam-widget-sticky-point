
import { getPointWidgetsFromSceneNodes } from '../utils/pointWidget';
import { groupWidget, ungroupWidget } from '../utils/grouping';

export function useOrganizerWidget() {
  const groupSelectedItems = async () => {
    const selectedPointWidgets = getPointWidgetsFromSceneNodes(figma.currentPage.selection);
    for (const node of selectedPointWidgets) {
      groupWidget(node);
    }
    figma.notify('Selected Point Widgets grouped!');
  };

  const ungroupSelectedItems = async (isForceMode: boolean = false) => {
    const selectedPointWidgets = getPointWidgetsFromSceneNodes(figma.currentPage.selection);
    for (const node of selectedPointWidgets) {
      ungroupWidget(node, isForceMode);
    }
    figma.notify('Selected Point Widgets ungrouped!');
  };

  return {
    groupSelectedItems,
    ungroupSelectedItems,
  };
}
