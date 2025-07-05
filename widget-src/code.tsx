// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useStickable, Input, useEffect } = widget

type Size = 'small' | 'medium' | 'large'

function Widget() {
  const [widgetType, setWidgetType] = useSyncedState('widgetType', 'point')
  const [size, setSize] = useSyncedState<Size>('size', 'small')
  const [backgroundColor, setBackgroundColor] = useSyncedState<string>('backgroundColor', '#FFFFFF')

  usePropertyMenu(
    [
      {
        itemType: 'dropdown',
        propertyName: 'widgetType',
        tooltip: 'Widget type',
        selectedOption: widgetType,
        options: [
          { option: 'point', label: 'Point' },
          { option: 'counter', label: 'Counter Tool' },
        ],
      },
      {
        itemType: 'dropdown',
        propertyName: 'size',
        tooltip: 'Widget Size',
        selectedOption: size,
        options: [
          { option: 'small', label: 'Small' },
          { option: 'medium', label: 'Medium' },
          { option: 'large', label: 'Large' },
        ],
      },
      {
        itemType: 'color-selector',
        propertyName: 'backgroundColor',
        tooltip: 'Background Color',
        selectedOption: backgroundColor,
        options: [
          { option: '#FFFFFF', tooltip: 'White' },
          { option: '#FFF9C4', tooltip: 'Yellow' },
          { option: '#FFD800', tooltip: 'Bright Yellow' },
          { option: '#C8E6C9', tooltip: 'Green' },
          { option: '#BBDEFB', tooltip: 'Blue' },
          { option: '#F8BBD9', tooltip: 'Pink' },
          { option: '#E1BEE7', tooltip: 'Purple' },
          { option: '#FFCDD2', tooltip: 'Red' },
          { option: '#FFE0B2', tooltip: 'Orange' },
          { option: '#F57F17', tooltip: 'Dark Yellow' },
          { option: '#2E7D32', tooltip: 'Dark Green' },
          { option: '#1565C0', tooltip: 'Dark Blue' },
          { option: '#C2185B', tooltip: 'Dark Pink' },
          { option: '#7B1FA2', tooltip: 'Dark Purple' },
          { option: '#D32F2F', tooltip: 'Dark Red' },
          { option: '#E65100', tooltip: 'Dark Orange' },
        ],
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'widgetType' && propertyValue) {
        setWidgetType(propertyValue)
      } else if (propertyName === 'size' && propertyValue) {
        setSize(propertyValue as Size)
      } else if (propertyName === 'backgroundColor' && propertyValue) {
        setBackgroundColor(propertyValue)
      }
    },
  )

  if (widgetType === 'point') {
    return <PointWidget size={size} backgroundColor={backgroundColor} />
  } else {
    return <CounterWidget />
  }
}

function PointWidget({ size, backgroundColor }: { size: Size; backgroundColor: string }) {
  const [point, setPoint] = useSyncedState<number>('point', 0)
  useStickable()

  // サイズ設定を定義
  const sizeConfig: Record<Size, {
    fontSize: number
    width: number
    padding: number
    cornerRadius: number
  }> = {
    small: {
      fontSize: 16,
      width: 72,
      padding: 6,
      cornerRadius: 4
    },
    medium: {
      fontSize: 24,
      width: 72,
      padding: 8,
      cornerRadius: 8
    },
    large: {
      fontSize: 32,
      width: 72,
      padding: 12,
      cornerRadius: 10
    }
  }

  // 濃い色かどうかを判定する関数
  const isDarkColor = (color: string): boolean => {
    const darkColors = [
      '#F57F17', // Dark Yellow
      '#2E7D32', // Dark Green
      '#1565C0', // Dark Blue
      '#C2185B', // Dark Pink
      '#7B1FA2', // Dark Purple
      '#D32F2F', // Dark Red
      '#E65100', // Dark Orange
    ]
    return darkColors.includes(color)
  }

  const config = sizeConfig[size]
  const textColor = isDarkColor(backgroundColor) ? '#FFFFFF' : '#000000'

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      padding={config.padding}
      cornerRadius={config.cornerRadius}
      fill={backgroundColor}
      stroke={'#000000'}
      strokeWidth={1}
    >
      <Input
        value={point.toString()}
        placeholder="0"
        onTextEditEnd={(e) => {
          const newValue = parseFloat(e.characters)
          if (!isNaN(newValue)) {
            setPoint(newValue)
          }
        }}
        fontSize={config.fontSize}
        width={config.width}
        horizontalAlignText={'center'}
        fill={textColor}
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
      const point = widget.widgetSyncedState['point']
      if (typeof point === 'number') {
        return point
      }
      return 0
    }).reduce((a, b) => a + b, 0);

    setTotal(sum)
  }

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={16}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#000000'}
      direction="vertical"
    >
      <Text fontSize={40} fontWeight={600}>Point Counter</Text>
      
      <AutoLayout verticalAlignItems={'center'}>
        <Text fontSize={24}>Total: </Text>
        <Text fontSize={24}>{total}</Text>
        <Text fontSize={24}> points</Text>
      </AutoLayout>
      <AutoLayout horizontalAlignItems={'end'}>
        <AutoLayout
          stroke={'#000000'}
          fill={'#FFFFFF'}
          cornerRadius={8}
          padding={8}
          width={100}
          height={40}
          verticalAlignItems={'center'}
          horizontalAlignItems={'center'}
          onClick={calculateTotal}
        >
          <Text fontSize={24}>Count</Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)

// Stickyノートを収集する関数（再帰的に探索）
function getPointWidgets(node: SceneNode): WidgetNode[] {
  const isPointWidget = (node: SceneNode): node is WidgetNode => {
    return node.type === 'WIDGET' && node.widgetId === figma.widgetId && node.widgetSyncedState['widgetType'] === 'point'
  }

  const pointWidgets: WidgetNode[] = [];

  // Stickyノートの場合、stickies配列に追加
  if (isPointWidget(node)) {
    pointWidgets.push(node);
  }

  // セクションの場合、その中のすべての子要素を再帰的に処理
  if (node.type === 'SECTION') {
    node.children.forEach(child => {
      pointWidgets.push(...getPointWidgets(child));
    });
  }

  if (node.type === 'STICKY') {
    node.stuckNodes.forEach(stuckNode => {
      pointWidgets.push(...getPointWidgets(stuckNode));
    })
  }

  return pointWidgets;
}
