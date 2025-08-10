const { widget } = figma;
const { useSyncedState } = widget;

import { getPointWidgetsFromSceneNodes } from '../utils/pointWidget';
import { Tag } from '../types';

export const useStickyTaggerWidget = () => {
  const [tags, setTags] = useSyncedState<Tag[]>('stickyTaggerTags', []);
  const [showConfirmDelete, setShowConfirmDelete] = useSyncedState<boolean>('showConfirmDelete', false);
  const [tagIdToDelete, setTagIdToDelete] = useSyncedState<string | null>('tagIdToDelete', null);
  const [showConfirmBulkDelete, setShowConfirmBulkDelete] = useSyncedState('showConfirmBulkDelete', false);
  const [widgetsToDeleteCount, setWidgetsToDeleteCount] = useSyncedState('widgetsToDeleteCount', 0);

  const handleTagClick = async (templateWidgetId: string) => {
    const selection = figma.currentPage.selection;
    const stickyNotes = selection.filter(node => node.type === 'STICKY');

    if (stickyNotes.length === 0) {
      figma.notify('Please select sticky notes.');
      return;
    }

    const templateWidget = await figma.getNodeByIdAsync(templateWidgetId);

    if (!templateWidget || templateWidget.type !== 'WIDGET') {
      figma.notify('Template widget not found or invalid.');
      return;
    }

    const isPointWidget = (node: SceneNode): node is WidgetNode => {
      return node.type === 'WIDGET' && node.widgetId === figma.widgetId && node.widgetSyncedState['widgetType'] === 'point';
    };

    let appliedCount = 0;
    let skippedCount = 0;

    for (const stickyNote of stickyNotes) {
      const hasExistingPointWidget = stickyNote.stuckNodes.some(isPointWidget);

      if (hasExistingPointWidget) {
        skippedCount++;
        continue;
      }

      const clonedWidget = templateWidget.clone();

      const INSET_OFFSET = 5;
      const widgetWidth = clonedWidget.width;
      const widgetHeight = clonedWidget.height;

      clonedWidget.x = stickyNote.x + stickyNote.width - widgetWidth - INSET_OFFSET;
      clonedWidget.y = stickyNote.y + stickyNote.height - widgetHeight - INSET_OFFSET;

      if (stickyNote.parent) {
        stickyNote.parent.appendChild(clonedWidget);
      }
      appliedCount++;
    }

    let message = '';
    if (appliedCount > 0) {
      message += `Applied tags to ${appliedCount} sticky note(s).`;
    }
    if (skippedCount > 0) {
      if (message) {
        message += ' ';
      }
      message += `Skipped ${skippedCount} note(s) that already had a tag.`;
    }
    
    if (message) {
      figma.notify(message);
    } else if (stickyNotes.length > 0) {
      figma.notify('Selected sticky notes already have tags.');
    }
  };

  const handleDeleteTag = (tagId: string) => {
    setTagIdToDelete(tagId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (tagIdToDelete) {
      setTags(tags.filter(tag => tag.id !== tagIdToDelete));
      figma.notify('Tag deleted.');
    }
    setShowConfirmDelete(false);
    setTagIdToDelete(null);
  };

  const cancelDelete = () => {
    figma.notify('Tag deletion cancelled.');
    setShowConfirmDelete(false);
    setTagIdToDelete(null);
  };

  const handleRegisterTemplate = async () => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please select widgets or a section to register as a template.');
      return;
    }

    const widgetsToRegister = getPointWidgetsFromSceneNodes(selection);

    if (widgetsToRegister.length === 0) {
      figma.notify('No widgets found in the selection. Please select widgets to register.');
      return;
    }

    const newTags: Tag[] = [];
    let alreadyRegisteredCount = 0;

    for (const widget of widgetsToRegister) {
      if (tags.some(tag => tag.templateWidgetId === widget.id)) {
        alreadyRegisteredCount++;
        continue;
      }

      const point = (widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number') 
                      ? widget.widgetSyncedState.point 
                      : 0;

      const newTag: Tag = {
        id: `tag-${widget.id}-${Date.now()}`,
        label: "Point",
        templateWidgetId: widget.id,
        point: point,
        backgroundColor: widget.widgetSyncedState.backgroundColor as string,
        textColor: widget.widgetSyncedState.textColor as string,
      };
      newTags.push(newTag);
    }

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    
    let notificationMessage = '';
    if (newTags.length > 0) {
        notificationMessage += `${newTags.length} new template(s) registered.`;
    }
    if (alreadyRegisteredCount > 0) {
        if (notificationMessage) notificationMessage += ' ';
        notificationMessage += `${alreadyRegisteredCount} template(s) were already registered.`;
    }
    if (!notificationMessage) {
        notificationMessage = 'Selected widget(s) are already registered.';
    }

    figma.notify(notificationMessage);
  };

  const handleBulkDelete = () => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('Please make a selection first.');
      return;
    }

    const pointWidgetsToDelete = getPointWidgetsFromSceneNodes(selection);

    if (pointWidgetsToDelete.length === 0) {
      figma.notify("No 'Point' widgets found in the selection.");
      return;
    }
    setWidgetsToDeleteCount(pointWidgetsToDelete.length);
    setShowConfirmBulkDelete(true);
  };

  const confirmBulkDelete = () => {
    const selection = figma.currentPage.selection;
    const pointWidgetsToDelete = getPointWidgetsFromSceneNodes(selection);

    const templateIds = new Set(tags.map(tag => tag.templateWidgetId));

    let deleteCount = 0;
    let skippedCount = 0;

    for (const widget of pointWidgetsToDelete) {
      if (templateIds.has(widget.id)) {
        skippedCount++;
        continue;
      }

      if (!widget.removed) {
        widget.remove();
        deleteCount++;
      }
    }

    let message = '';
    if (deleteCount > 0) {
      message += `Successfully deleted ${deleteCount} 'Point' widget(s).`;
    }
    if (skippedCount > 0) {
      if (message) {
        message += ' ';
      }
      message += `Skipped ${skippedCount} widget(s) used as templates.`;
    }

    if (message) {
      figma.notify(message);
    } else if (pointWidgetsToDelete.length > 0) {
      figma.notify('No widgets to delete. Selected items are registered templates.');
    }
    
    setShowConfirmBulkDelete(false);
    setWidgetsToDeleteCount(0);
  };

  const cancelBulkDelete = () => {
    setShowConfirmBulkDelete(false);
    setWidgetsToDeleteCount(0);
    figma.notify('Bulk deletion cancelled.');
  };

  const tagToDelete = tagIdToDelete ? tags.find(tag => tag.id === tagIdToDelete) : null;

  return {
    tags,
    showConfirmDelete,
    tagIdToDelete,
    showConfirmBulkDelete,
    widgetsToDeleteCount,
    handleTagClick,
    handleDeleteTag,
    confirmDelete,
    cancelDelete,
    handleRegisterTemplate,
    handleBulkDelete,
    confirmBulkDelete,
    cancelBulkDelete,
    tagToDelete,
  };
};
