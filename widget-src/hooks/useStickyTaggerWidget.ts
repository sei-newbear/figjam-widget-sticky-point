const { widget } = figma;
const { useSyncedState, useWidgetNodeId } = widget;

import { getPointWidgetsFromSceneNodes, applyPointWidgetToStickies, deletePointWidgets } from '../utils/pointWidget';
import { createPointTemplateFromWidget, filterNewTemplates } from '../logic/taggingLogic';
import { PointTemplate, StickyTaggerSizeMode } from '../types';

export const useStickyTaggerWidget = () => {
  const widgetId = useWidgetNodeId();
  const [templates, setTemplates] = useSyncedState<PointTemplate[]>('stickyTaggerTemplates', []);
  const [showConfirmDelete, setShowConfirmDelete] = useSyncedState<boolean>('showConfirmDelete', false);
  const [templateIdToDelete, setTemplateIdToDelete] = useSyncedState<string | null>('templateIdToDelete', null);
  const [showConfirmBulkDelete, setShowConfirmBulkDelete] = useSyncedState('showConfirmBulkDelete', false);
  const [widgetsToDeleteCount, setWidgetsToDeleteCount] = useSyncedState('widgetsToDeleteCount', 0);
  const [stickyTaggerSizeMode, setStickyTaggerSizeMode] = useSyncedState<StickyTaggerSizeMode>('stickyTaggerSizeMode', 'normal');

  // --- Tag Application ---

  const handleTemplateClick = async (template: PointTemplate) => {
    const selection = figma.currentPage.selection;
    const stickyNotes = selection.filter(node => node.type === 'STICKY');

    if (stickyNotes.length === 0) {
      figma.notify('Please select sticky notes.');
      return;
    }

    const { appliedCount, skippedCount } = await applyPointWidgetToStickies(widgetId, template, stickyNotes);

    // Notification logic
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

    const { newWidgets, alreadyRegisteredCount } = filterNewTemplates(widgetsToRegister, templates);
    
    const newTemplates = newWidgets.map(createPointTemplateFromWidget);

    if (newTemplates.length > 0) {
      setTemplates([...templates, ...newTemplates]);
    }
    
    // Notification logic
    let message = '';
    if (newTemplates.length > 0) {
        message += `${newTemplates.length} new template(s) registered.`;
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

  // --- Template Deletion ---

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateIdToDelete(templateId);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (templateIdToDelete) {
      setTemplates(templates.filter(template => template.id !== templateIdToDelete));
      figma.notify('Template deleted.');
    }
    setShowConfirmDelete(false);
    setTemplateIdToDelete(null);
  };

  const cancelDelete = () => {
    figma.notify('Template deletion cancelled.');
    setShowConfirmDelete(false);
    setTemplateIdToDelete(null);
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

    const deleteCount = deletePointWidgets(pointWidgetsToDelete);

    // Notification logic
    if (deleteCount > 0) {
      figma.notify(`Successfully deleted ${deleteCount} 'Point' widget(s).`);
    } else {
      figma.notify('No widgets were deleted.');
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

  const templateToDelete = templateIdToDelete ? templates.find(t => t.id === templateIdToDelete) : null;

  return {
    templates,
    showConfirmDelete,
    templateToDelete,
    showConfirmBulkDelete,
    widgetsToDeleteCount,
    handleTemplateClick,
    handleDeleteTemplate,
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