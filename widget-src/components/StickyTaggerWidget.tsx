const { widget } = figma;
const { AutoLayout, Text } = widget;
const { useSyncedState } = widget;

export function StickyTaggerWidget() {
  const [tags, setTags] = useSyncedState<Array<{ id: string, label: string, templateWidgetId: string, point: number }>>('stickyTaggerTags', []);
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

    for (const stickyNote of stickyNotes) {
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
    }
    figma.notify(`Applied tags to ${stickyNotes.length} sticky notes.`);
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
      figma.notify('Please select a widget to register as a template.');
      return;
    }
    if (selection.length > 1) {
      figma.notify('Only one widget can be registered as a template.');
      return;
    }

    const selectedNode = selection[0];

    // 選択されたノードがウィジェットであるかを確認
    if (selectedNode.type !== 'WIDGET') {
      figma.notify('The selected node is not a widget.');
      return;
    }

    // 既に同じテンプレートが登録されていないかチェック
    if (tags.some(tag => tag.templateWidgetId === selectedNode.id)) {
      figma.notify('This widget is already registered as a template.');
      return;
    }

    const label = selectedNode.name || 'Unnamed Tag';
    const point = selectedNode.widgetSyncedState.point as number || 0;

    const newTag = {
      id: `tag-${Date.now()}`,
      label: label,
      templateWidgetId: selectedNode.id,
      point: point,
    };
    setTags([...tags, newTag]);
    figma.notify(`"${label}" has been registered as a template.`);
  };

  const tagToDeleteLabel = tagIdToDelete ? tags.find(tag => tag.id === tagIdToDelete)?.label : '';

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      padding={20}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={280}
      spacing={10}
      positioning="auto"
    >
      <Text fontSize={28} fontWeight={700} fill={'#1A1A1A'}>Sticky Tagger</Text>
      <Text fontSize={14} fill={'#6C757D'}>Apply tags to selected sticky notes</Text>

      <AutoLayout
        onClick={handleRegisterTemplate}
        fill="#28A745"
        cornerRadius={8}
        padding={10}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        hoverStyle={{ opacity: 0.9 }}
        width={160}
        height={32}
        tooltip="Click to add the selected widget to your list of tag templates. Ensure only one widget is selected."
      >
        <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>Add Template</Text>
      </AutoLayout>

      <AutoLayout height={10} />

      {tags.length > 0 ? (
        <AutoLayout direction="vertical" spacing={8}>
          {tags.map((tag) => (
            <AutoLayout
              key={tag.id}
              direction="horizontal"
              verticalAlignItems="center"
              spacing={4}
            >
              <AutoLayout
                onClick={() => handleTagClick(tag.templateWidgetId)}
                fill={'#007BFF'}
                cornerRadius={8}
                padding={{ horizontal: 12, vertical: 8 }}
                horizontalAlignItems="center"
                verticalAlignItems="center"
                hoverStyle={{ opacity: 0.9 }}
              >
                <Text fill={'#FFFFFF'} fontSize={16} fontWeight={600}>{tag.label} ({tag.point})</Text>
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

      {showConfirmDelete && (
        <AutoLayout
          fill="#00000080" // Semi-transparent overlay
          width={280}
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
            width={280}
          >
            <Text fontSize={18} fontWeight={700}>Confirm Deletion</Text>
            <Text fontSize={14} width={240} horizontalAlignText="center">{`Are you sure you want to delete "${tagToDeleteLabel}"?`}</Text>
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
    </AutoLayout>
  );
}

