// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useStickable, Input, useEffect } = widget

type Size = 'small' | 'medium' | 'large'

function Widget() {
  const [widgetType, setWidgetType] = useSyncedState('widgetType', 'point')
  const [size, setSize] = useSyncedState<Size>('size', 'small')
  const [backgroundColor, setBackgroundColor] = useSyncedState<string>('backgroundColor', '#FFFFFF')
  const [textColor, setTextColor] = useSyncedState<string>('textColor', '#000000')
  const [width, setWidth] = useSyncedState<number>('width', 72)

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
        itemType: 'dropdown',
        propertyName: 'width',
        tooltip: 'Widget Width',
        selectedOption: width.toString(),
        options: [
          { option: '52', label: 'Narrow' },
          { option: '72', label: 'Normal' },
          { option: '104', label: 'Wide' },
        ],
      },
      {
        itemType: 'color-selector',
        propertyName: 'backgroundColor',
        tooltip: 'Background Color',
        selectedOption: backgroundColor,
        options: [
          { option: '#FFFFFF', tooltip: 'White' },
          { option: '#FFCDD2', tooltip: 'Light Red' },
          { option: '#FFE0B2', tooltip: 'Light Orange' },
          { option: '#FFF9C4', tooltip: 'Light Yellow' },
          { option: '#C8E6C9', tooltip: 'Light Green' },
          { option: '#BBDEFB', tooltip: 'Light Blue' },
          { option: '#81D4FA', tooltip: 'Light Cyan' },
          { option: '#E1BEE7', tooltip: 'Light Purple' },
          { option: '#F8BBD9', tooltip: 'Light Pink' },
          { option: '#D32F2F', tooltip: 'Red' },
          { option: '#E65100', tooltip: 'Orange' },
          { option: '#FFD800', tooltip: 'Yellow' },
          { option: '#2E7D32', tooltip: 'Green' },
          { option: '#1565C0', tooltip: 'Blue' },
          { option: '#00BCD4', tooltip: 'Cyan' },
          { option: '#7B1FA2', tooltip: 'Purple' },
          { option: '#EF5B9C', tooltip: 'Pink' },
          { option: '#000000', tooltip: 'Black' },
        ],
      },
      {
        itemType: 'color-selector',
        propertyName: 'textColor',
        tooltip: 'Text Color',
        selectedOption: textColor,
        options: [
          { option: '#000000', tooltip: 'Black Font' },
          { option: '#FFFFFF', tooltip: 'White Font' },
          { option: '#FF0000', tooltip: 'Red Font' },
        ],
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'widgetType' && propertyValue) {
        setWidgetType(propertyValue)
      } else if (propertyName === 'size' && propertyValue) {
        setSize(propertyValue as Size)
      } else if (propertyName === 'width' && propertyValue) {
        setWidth(parseInt(propertyValue))
      } else if (propertyName === 'backgroundColor' && propertyValue) {
        setBackgroundColor(propertyValue)
      } else if (propertyName === 'textColor' && propertyValue) {
        setTextColor(propertyValue)
      }
    },
  )

  if (widgetType === 'point') {
    return <PointWidget size={size} backgroundColor={backgroundColor} textColor={textColor} width={width} />
  } else {
    return <CounterWidget />
  }
}

function PointWidget({ size, backgroundColor, textColor, width }: { size: Size; backgroundColor: string; textColor: string; width: number }) {
  const [point, setPoint] = useSyncedState<number>('point', 0)
  useStickable()

  // サイズ設定を定義
  const sizeConfig: Record<Size, {
    fontSize: number
    padding: number
    cornerRadius: number
  }> = {
    small: {
      fontSize: 16,
      padding: 6,
      cornerRadius: 4
    },
    medium: {
      fontSize: 24,
      padding: 8,
      cornerRadius: 8
    },
    large: {
      fontSize: 32,
      padding: 12,
      cornerRadius: 10
    }
  }

  const config = sizeConfig[size]

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
        width={width}
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
    const pointWidgets: WidgetNode[] = getPointWidgetsFromSceneNodes(selection);

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
      horizontalAlignItems={'center'}
      spacing={24}
      padding={24}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={320}
    >
      <Text fontSize={32} fontWeight={700} fill={'#1A1A1A'}>Point Counter</Text>
      
      <AutoLayout 
        verticalAlignItems={'center'} 
        spacing={8}
        padding={16}
        cornerRadius={8}
        fill={'#F8F9FA'}
        stroke={'#E9ECEF'}
        strokeWidth={1}
      >
        <Text fontSize={20} fontWeight={500} fill={'#495057'}>Total:</Text>
        <Text fontSize={28} fontWeight={700} fill={'#0066FF'}>{total}</Text>
        <Text fontSize={20} fontWeight={500} fill={'#495057'}>points</Text>
      </AutoLayout>
      
      <AutoLayout horizontalAlignItems={'center'} width="fill-parent">
        <AutoLayout
          stroke={'#0066FF'}
          fill={'#0066FF'}
          cornerRadius={8}
          padding={12}
          width={120}
          height={48}
          verticalAlignItems={'center'}
          horizontalAlignItems={'center'}
          onClick={calculateTotal}
        >
          <Text fontSize={18} fontWeight={600} fill={'#FFFFFF'}>Count</Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)

function getPointWidgetsFromSceneNodes(sceneNodes: readonly SceneNode[]): WidgetNode[] {
  const pointWidgetsMap = new Map<string, WidgetNode>();
  
  sceneNodes.forEach(node => {
    const widgets = getPointWidgets(node);
    widgets.forEach(widget => {
      // IDでユニークにする
      pointWidgetsMap.set(widget.id, widget);
    });
  });

  return Array.from(pointWidgetsMap.values());
}

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
