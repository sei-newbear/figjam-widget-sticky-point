const { widget } = figma;
const { AutoLayout, Text } = widget;
const { useSyncedState } = widget;
import { getPointWidgetsFromSceneNodes } from '../utils/pointWidget';

interface Tag {
  id: string;
  label: string;
  templateWidgetId: string;
  point: number;
  backgroundColor?: string;
  textColor?: string;
}

export function StickyTaggerWidget() {
  const [tags, setTags] = useSyncedState<Tag[]>('stickyTaggerTags', []);
  const [showConfirmDelete, setShowConfirmDelete] = useSyncedState<boolean>('showConfirmDelete', false);
  const [tagIdToDelete, setTagIdToDelete] = useSyncedState<string | null>('tagIdToDelete', null);

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

      // 付箋の右下に配置するための座標を計算
      const INSET_OFFSET = 5; // Offset from right and bottom edges
      const widgetWidth = clonedWidget.width;
      const widgetHeight = clonedWidget.height;

      clonedWidget.x = stickyNote.x + stickyNote.width - widgetWidth - INSET_OFFSET;
      clonedWidget.y = stickyNote.y + stickyNote.height - widgetHeight - INSET_OFFSET;

      // 付箋と同じ親にクローンされたウィジェットを追加
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

    const newTags: { id: string; label: string; templateWidgetId: string; point: number; }[] = [];
    let alreadyRegisteredCount = 0;

    for (const widget of widgetsToRegister) {
      // 既に同じテンプレートが登録されていないかチェック
      if (tags.some(tag => tag.templateWidgetId === widget.id)) {
        alreadyRegisteredCount++;
        continue;
      }

      const label = widget.name || 'Unnamed Tag';
      // pointの取得方法を安全にする
      const point = (widget.widgetSyncedState.point && typeof widget.widgetSyncedState.point === 'number') 
                      ? widget.widgetSyncedState.point 
                      : 0;

      const newTag: Tag = {
        id: `tag-${widget.id}-${Date.now()}`, // IDが一意になるようにwidget.idも加える
        label: label,
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
    
    // 通知メッセージを作成
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

  const [showConfirmBulkDelete, setShowConfirmBulkDelete] = useSyncedState('showConfirmBulkDelete', false);
  const [widgetsToDeleteCount, setWidgetsToDeleteCount] = useSyncedState('widgetsToDeleteCount', 0);

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

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      padding={16}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={260}
      spacing={8}
      positioning="auto"
    >
      <Text fontSize={24} fontWeight={700} fill={'#1A1A1A'}>Sticky Tagger</Text>

      <AutoLayout direction="vertical" spacing={10} width="fill-parent" horizontalAlignItems="center">

        {/* --- Template Management --- */}
        <AutoLayout spacing={8} verticalAlignItems="center" width="fill-parent" horizontalAlignItems="end">
          <AutoLayout
            onClick={handleRegisterTemplate}
            fill="#28A745"
            cornerRadius={8}
            padding={{ horizontal: 12, vertical: 6 }}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ opacity: 0.9 }}
          >
            <Text fill="#FFFFFF" fontSize={14} fontWeight={600}>Add to Palette</Text>
          </AutoLayout>
          <AutoLayout
            tooltip="Adds selected 'Point' widgets to the palette. You can select multiple widgets or a section. Important: The original widget is used as the template, so if you delete it from the canvas, this tag will stop working."
            width={16}
            height={16}
            cornerRadius={999}
            stroke={'#6C757D'}
            strokeWidth={1}
            horizontalAlignItems="center"
            verticalAlignItems="center"
            hoverStyle={{ stroke: '#1A1A1A' }}
          >
            <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
          </AutoLayout>
        </AutoLayout>

        <AutoLayout height={1} width="fill-parent" fill={'#E0E0E0'} />

        {/* --- Apply Tags --- */}
        <AutoLayout direction="vertical" spacing={4} width="fill-parent">
          <AutoLayout spacing={8} verticalAlignItems="center">
            <Text fontSize={16} fontWeight={700}>Tag Palette</Text>
            <AutoLayout
              tooltip="Select one or more sticky notes, then click a tag to apply."
              width={16}
              height={16}
              cornerRadius={999}
              stroke={'#6C757D'}
              strokeWidth={1}
              horizontalAlignItems="center"
              verticalAlignItems="center"
              hoverStyle={{ stroke: '#1A1A1A' }}
            >
              <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>

      {tags.length > 0 ? (
        <AutoLayout direction="vertical" spacing={8}>
          {[...tags].sort((a, b) => a.point - b.point).map((tag) => (
            <AutoLayout
              key={tag.id}
              direction="horizontal"
              verticalAlignItems="center"
              spacing={4}
            >
              <AutoLayout
                onClick={() => handleTagClick(tag.templateWidgetId)}
                fill={tag.backgroundColor || '#007BFF'}
                cornerRadius={8}
                padding={{ horizontal: 10, vertical: 5 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
                stroke={'#000000'}
                strokeWidth={1}
              >
                <Text fill={tag.textColor || '#FFFFFF'} fontSize={14} fontWeight={600}>{tag.label} ({tag.point})</Text>
              </AutoLayout>
              <AutoLayout
                onClick={() => handleDeleteTag(tag.id)}
                fill={'#DC3545'}
                cornerRadius={999}
                width={20}
                height={20}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill={'#FFFFFF'} fontSize={12} fontWeight={600}>X</Text>
              </AutoLayout>
            </AutoLayout>
          ))}
        </AutoLayout>
      ) : (
        <Text fontSize={14} fill={'#6C757D'}>No templates registered yet.</Text>
      )}

      <AutoLayout height={4} />

      {/* Separator */}
      <AutoLayout height={1} width="fill-parent" fill={'#E0E0E0'} />

      {/* Bulk Delete Button */}
      <AutoLayout spacing={8} verticalAlignItems="center" horizontalAlignItems="end" width="fill-parent">
        <AutoLayout
          onClick={handleBulkDelete}
          fill={'#DC3545'}
          cornerRadius={8}
          padding={{ horizontal: 12, vertical: 6 }}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          hoverStyle={{ opacity: 0.9 }}
        >
          <Text fill={'#FFFFFF'} fontSize={14} fontWeight={600}>Bulk Delete Tags</Text>
        </AutoLayout>
        <AutoLayout
          tooltip="Deletes all 'Point' widgets found within the current selection. Widgets registered as templates in the palette will be skipped."
          width={16}
          height={16}
          cornerRadius={999}
          stroke={'#6C757D'}
          strokeWidth={1}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          hoverStyle={{ stroke: '#1A1A1A' }}
        >
          <Text fontSize={10} fontWeight={700} fill={'#6C757D'} hoverStyle={{ fill: '#1A1A1A' }}>i</Text>
        </AutoLayout>
      </AutoLayout>

      {showConfirmDelete && (
        <AutoLayout
          fill="#00000080" // Semi-transparent overlay
          width={260}
          height={250}
          verticalAlignItems="center"
          horizontalAlignItems="center"
          positioning="absolute"
        >
          <AutoLayout
            fill="#FFFFFF"
            cornerRadius={12}
            padding={20}
            direction="vertical"
            spacing={16}
            horizontalAlignItems="center"
            width={260}
          >
            <Text fontSize={18} fontWeight={700}>Confirm Deletion</Text>
            <Text fontSize={14} width={220} horizontalAlignText="center">{tagToDelete ? `Are you sure you want to delete "${tagToDelete.label}" (${tagToDelete.point} pts)?` : ''}</Text>
            <AutoLayout direction="horizontal" spacing={12}>
              <AutoLayout
                onClick={confirmDelete}
                fill="#DC3545"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Yes</Text>
              </AutoLayout>
              <AutoLayout
                onClick={cancelDelete}
                fill="#6C757D"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>No</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}

      {showConfirmBulkDelete && (
        <AutoLayout
          fill="#00000080" // Semi-transparent overlay
          width={260}
          height={250}
          verticalAlignItems="center"
          horizontalAlignItems="center"
          positioning="absolute"
        >
          <AutoLayout
            fill="#FFFFFF"
            cornerRadius={12}
            padding={20}
            direction="vertical"
            spacing={16}
            horizontalAlignItems="center"
            width={260}
          >
            <Text fontSize={18} fontWeight={700}>Confirm Bulk Deletion</Text>
            <Text fontSize={14} width={220} horizontalAlignText="center">
              {`Are you sure you want to delete ${widgetsToDeleteCount} 'Point' widget(s) from your selection?`}
            </Text>
            <AutoLayout direction="horizontal" spacing={12}>
              <AutoLayout
                onClick={confirmBulkDelete}
                fill="#DC3545"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Yes, Delete</Text>
              </AutoLayout>
              <AutoLayout
                onClick={cancelBulkDelete}
                fill="#6C757D"
                cornerRadius={8}
                padding={{ horizontal: 16, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Cancel</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

