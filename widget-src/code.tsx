// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useStickable, Input } = widget

function Widget() {
  const [widgetType, setWidgetType] = useSyncedState('widgetType', 'point')

  usePropertyMenu(
    [
      {
        itemType: 'dropdown',
        propertyName: 'widgetType',
        tooltip: 'Widget Type',
        selectedOption: widgetType,
        options: [
          { option: 'point', label: 'Point' },
          { option: 'counter', label: 'Counter' },
        ],
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'widgetType' && propertyValue) {
        setWidgetType(propertyValue)
      }
    },
  )

  if (widgetType === 'point') {
    return <PointWidget />
  } else {
    return <CounterWidget />
  }
}

function PointWidget() {
  const [count, setCount] = useSyncedState('count', 0)
  useStickable()

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      // spacing={8}
      padding={8}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
    >
      <Input
        value={String(count)}
        placeholder="0"
        onTextEditEnd={(e) => {
          const newValue = parseInt(e.characters, 10)
          if (!isNaN(newValue)) {
            setCount(newValue)
          }
        }}
        fontSize={24}
        width={64}
        horizontalAlignText={'center'}
      />
    </AutoLayout>
  )
}

function CounterWidget() {
  const [total, setTotal] = useSyncedState('total', 0)

  const calculateTotal = () => {
    // 選択されたすべてのノードについてStickyノートを収集
    const selection = figma.currentPage.selection;
    const pointWidgets: WidgetNode[] = [];
    selection.forEach(node => {
      pointWidgets.push(...getPointWidgets(node));
    });

    const sum = pointWidgets.map(widget => {
      const count = widget.widgetSyncedState['count']
      if (typeof count === 'number') {
        return count
      }
      return 0
    }).reduce((a, b) => a + b, 0);

    setTotal(sum)
  }

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
    >
      <Text fontSize={24}>Total:</Text>
      <Text fontSize={32}>{total}</Text>
      <SVG
        src={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4.01 7.58 4.01 12C4.01 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="black"/>
        </svg>`}
        onClick={calculateTotal}
      />
    </AutoLayout>
  )
}

widget.register(Widget)

// Stickyノートを収集する関数（再帰的に探索）
function getPointWidgets(node: SceneNode): WidgetNode[] {
  let pointWidgets: WidgetNode[] = [];

  // セクションの場合、その中のすべての子要素を再帰的に処理
  if (node.type === 'SECTION') {
    node.children.forEach(child => {
      pointWidgets = pointWidgets.concat(getPointWidgets(child));
    });
  }

  // Stickyノートの場合、stickies配列に追加
  if (node.type === 'WIDGET' && node.widgetId === figma.widgetId && node.widgetSyncedState['widgetType'] === 'point') {
    pointWidgets.push(node);
  }

  return pointWidgets;
}
