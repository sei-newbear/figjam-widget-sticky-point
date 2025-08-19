const { widget } = figma;
const { useSyncedState } = widget;

import { getPointWidgetsFromSceneNodes, applyPointWidgetToStickies, deletePointWidgets } from '../utils/pointWidget';
import { createTagFromWidget, filterNewWidgets } from '../logic/taggingLogic';
import { Tag, StickyTaggerSizeMode } from '../types';

export const useStickyTaggerWidget = () => {
  const [tags, setTags] = useSyncedState<Tag[]>('stickyTaggerTags', []);
  const [showConfirmDelete, setShowConfirmDelete] = useSyncedState<boolean>('showConfirmDelete', false);
  const [tagIdToDelete, setTagIdToDelete] = useSyncedState<string | null>('tagIdToDelete', null);
  const [showConfirmBulkDelete, setShowConfirmBulkDelete] = useSyncedState('showConfirmBulkDelete', false);
  const [widgetsToDeleteCount, setWidgetsToDeleteCount] = useSyncedState('widgetsToDeleteCount', 0);
  const [stickyTaggerSizeMode, setStickyTaggerSizeMode] = useSyncedState<StickyTaggerSizeMode>('stickyTaggerSizeMode', 'normal');

  // --- Tag Application ---

  const handleTagClick = async (templateWidgetId: string) => {
    const selection = figma.currentPage.selection;
    const stickyNotes = selection.filter(node => node.type === 'STICKY');

    if (stickyNotes.length === 0) {
      figma.notify('Please select sticky notes.');
      return;
    }

    const templateWidget = await figma.getNodeByIdAsync(templateWidgetId);

    if (!templateWidget || templateWidget.type !== 'WIDGET' || templateWidget.widgetId !== figma.widgetId) {
      figma.notify('Template widget not found or invalid.');
      return;
    }

    const { appliedCount, skippedCount } = await applyPointWidgetToStickies(templateWidget, stickyNotes);

    // Notification logic remains in the hook as it's a UI concern.
    let message = '';
    if (appliedCount > 0) {
      message += `Applied tags to ${appliedCount} sticky note(s).`;
    }
    if (skippedCount > 0) {
      if (message) message += ' ';
      message += `Skipped ${skippedCount} note(s) that already had a tag.`;
    }
    
    if (message) {
      figma.notify(message);
    } else if (stickyNotes.length > 0) {
      figma.notify('Selected sticky notes already have tags.');
    }
  };

  // --- Template Registration ---

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

    const { newWidgets, alreadyRegisteredCount } = filterNewWidgets(widgetsToRegister, tags);
    
    const newTags = newWidgets.map(createTagFromWidget);

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    
    // Notification logic
    let message = '';
    if (newTags.length > 0) {
        message += `${newTags.length} new template(s) registered.`;
    }
    if (alreadyRegisteredCount > 0) {
        if (message) message += ' ';
        message += `${alreadyRegisteredCount} template(s) were already registered.`;
    }
    if (!message) {
        message = 'Selected widget(s) are already registered.';
    }
    figma.notify(message);
  };

  // --- Tag Deletion ---

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

  // --- Bulk Widget Deletion ---

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

    const { deleteCount, skippedCount } = deletePointWidgets(pointWidgetsToDelete, templateIds);

    // Notification logic
    let message = '';
    if (deleteCount > 0) {
      message += `Successfully deleted ${deleteCount} 'Point' widget(s).`;
    }
    if (skippedCount > 0) {
      if (message) message += ' ';
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

  // --- Returned State and Functions ---

  const tagToDelete = tagIdToDelete ? tags.find(tag => tag.id === tagIdToDelete) : null;

  return {
    tags,
    showConfirmDelete,
    tagToDelete,
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
    stickyTaggerSizeMode,
    setStickyTaggerSizeMode,
  };
};