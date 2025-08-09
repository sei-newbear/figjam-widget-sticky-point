const { widget } = figma;
const { AutoLayout, Text } = widget;
const { useSyncedState } = widget;



export function StickyTaggerWidget() {
  const [tags, setTags] = useSyncedState<Array<{ id: string, label: string, templateWidgetId: string, point: number }>>('stickyTaggerTags', []);

  const handleTagClick = async (templateWidgetId: string) => {
    const selection = figma.currentPage.selection;
    const stickyNotes = selection.filter(node => node.type === 'STICKY');

    if (stickyNotes.length === 0) {
      figma.notify('付箋を選択してください。');
      return;
    }

    const templateWidget = await figma.getNodeByIdAsync(templateWidgetId);

    if (!templateWidget || templateWidget.type !== 'WIDGET') {
      figma.notify('テンプレートウィジェットが見つからないか、無効です。');
      return;
    }

    for (const stickyNote of stickyNotes) {
      const clonedWidget = templateWidget.clone();

      // 付箋の右下に配置するための座標を計算
      const INSET_OFFSET = 5; // 右端と下端からのオフセット
      const widgetWidth = clonedWidget.width;
      const widgetHeight = clonedWidget.height;

      clonedWidget.x = stickyNote.x + stickyNote.width - widgetWidth - INSET_OFFSET;
      clonedWidget.y = stickyNote.y + stickyNote.height - widgetHeight - INSET_OFFSET;

      // 付箋と同じ親にクローンされたウィジェットを追加
      if (stickyNote.parent) {
        stickyNote.parent.appendChild(clonedWidget);
      }
    }
    figma.notify(`${stickyNotes.length}個の付箋にタグを貼り付けました。`);
  };

  const handleRegisterTemplate = async () => {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify('テンプレートとして登録するウィジェットを選択してください。');
      return;
    }
    if (selection.length > 1) {
      figma.notify('テンプレートとして登録できるウィジェットは1つだけです。');
      return;
    }

    const selectedNode = selection[0];

    // 選択されたノードがウィジェットであるかを確認
    if (selectedNode.type !== 'WIDGET') {
      figma.notify('選択されたノードはウィジェットではありません。');
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
    figma.notify(`「${label}」をテンプレートとして登録しました。`);
  };

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
    >
      <Text fontSize={28} fontWeight={700} fill={'#1A1A1A'}>Sticky Tagger</Text>
      <Text fontSize={14} fill={'#6C757D'}>選択した付箋にタグを貼り付けます</Text>

      <AutoLayout
        onClick={handleRegisterTemplate}
        fill="#28A745"
        cornerRadius={8}
        padding={10}
        horizontalAlignItems="center"
        verticalAlignItems="center"
        hoverStyle={{ opacity: 0.9 }}
        width={240}
        height={40}
      >
        <Text fill="#FFFFFF" fontSize={16} fontWeight={600}>選択中のウィジェットをテンプレート登録</Text>
      </AutoLayout>

      {tags.length > 0 ? (
        <AutoLayout direction="horizontal" spacing={8} wrap>
          {tags.map((tag) => (
            <AutoLayout
              key={tag.id}
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
          ))}
        </AutoLayout>
      ) : (
        <Text fontSize={14} fill={'#6C757D'}>まだテンプレートが登録されていません。</Text>
      )}
    </AutoLayout>
  );
}
