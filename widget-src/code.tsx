// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, useStickable, Input, useWidgetNodeId, useEffect } = widget

type WidgetType = 'point' | 'counter'
type Size = 'small' | 'medium' | 'large'
type CounterSizeMode = 'normal' | 'compact'
type CountTarget = 'manual' | 'section'

function Widget() {
  const [widgetType, setWidgetType] = useSyncedState<WidgetType>('widgetType', 'point')
  const [size, setSize] = useSyncedState<Size>('size', 'small')
  const [backgroundColor, setBackgroundColor] = useSyncedState<string>('backgroundColor', '#FFFFFF')
  const [textColor, setTextColor] = useSyncedState<string>('textColor', '#000000')
  const [width, setWidth] = useSyncedState<number>('width', 72)
  const [counterSizeMode, setCounterSizeMode] = useSyncedState<CounterSizeMode>('counterSizeMode', 'normal')
  const [countTarget, setCountTarget] = useSyncedState<CountTarget>('countTarget', 'manual')
  const [groupingEnabled, setGroupingEnabled] = useSyncedState<boolean>('groupingEnabled', false)

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
      // Point widget用のプロパティ
      ...(widgetType === 'point'
        ? [
            {
              itemType: 'dropdown' as const,
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
              itemType: 'dropdown' as const,
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
              itemType: 'color-selector' as const,
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
              itemType: 'color-selector' as const,
              propertyName: 'textColor',
              tooltip: 'Text Color',
              selectedOption: textColor,
              options: [
                { option: '#000000', tooltip: 'Black Font' },
                { option: '#FFFFFF', tooltip: 'White Font' },
                { option: '#FF0000', tooltip: 'Red Font' },
              ],
            },
            {
              itemType: 'toggle' as const,
              propertyName: 'groupingEnabled',
              tooltip: 'Automatically groups/ungroups with host (on attach/detach). Toggling also groups/ungroups.',
              isToggled: groupingEnabled,
              icon: `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill="${groupingEnabled ? '#FFFFFF' : '#6C757D'}" fill-rule="evenodd" d="M12 12h2v1h7v-1h2v2h-1v4h4v-1h2v2h-1v7h1v2h-2v-1h-7v1h-2v-2h1v-4h-4v1h-2v-2h1v-7h-1zm6 9.01V19h-1v-2h2v1h2.01v-4H21v-.01h-7V14h-.01v7H14v.01zM26.01 19v7H26v.01h-7V26h-.01v-7H19v-.01h7V19z"></path>
                <text x="23" y="17" font-family="sans-serif" font-size="10" fill="${groupingEnabled ? '#FFFFFF' : '#6C757D'}" style="font-weight: bold;">⟳</text>
              </svg>`,
            },
          ]
        : []),
      // Counter widget用のプロパティ
      ...(widgetType === 'counter'
        ? [
            {
              itemType: 'dropdown' as const,
              propertyName: 'counterSizeMode',
              tooltip: 'Counter Size',
              selectedOption: counterSizeMode,
              options: [
                { option: 'normal', label: 'Normal' },
                { option: 'compact', label: 'Compact' },
              ],
            },
            {
              itemType: 'dropdown' as const,
              propertyName: 'countTarget',
              tooltip: 'Count Target',
              selectedOption: countTarget,
              options: [
                { option: 'manual', label: 'Manual Selection' },
                { option: 'section', label: 'Containing Section' },
              ],
            },
          ]
        : []),
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === 'widgetType' && propertyValue) {
        setWidgetType(propertyValue as WidgetType)
      } else if (propertyName === 'size' && propertyValue) {
        setSize(propertyValue as Size)
      } else if (propertyName === 'width' && propertyValue) {
        setWidth(parseInt(propertyValue))
      } else if (propertyName === 'backgroundColor' && propertyValue) {
        setBackgroundColor(propertyValue)
      } else if (propertyName === 'textColor' && propertyValue) {
        setTextColor(propertyValue)
      } else if (propertyName === 'counterSizeMode' && propertyValue) {
        setCounterSizeMode(propertyValue as CounterSizeMode)
      } else if (propertyName === 'countTarget' && propertyValue) {
        setCountTarget(propertyValue as CountTarget)
      } else if (propertyName === 'groupingEnabled') {
        setGroupingEnabled(!groupingEnabled)
      }
    },
  )

  if (widgetType === 'point') {
    return <PointWidget size={size} backgroundColor={backgroundColor} textColor={textColor} width={width} groupingEnabled={groupingEnabled} />
  } else {
    return <CounterWidget counterSizeMode={counterSizeMode} countTarget={countTarget} />
  }
}

function PointWidget({ size, backgroundColor, textColor, width, groupingEnabled }: { size: Size; backgroundColor: string; textColor: string; width: number; groupingEnabled: boolean }) {
  const [point, setPoint] = useSyncedState<number>('point', 0)
  const [beforeGroupingEnabled, setBeforeGroupingEnabled] = useSyncedState<boolean>('beforeGroupingEnabled', false)
  const widgetNodId = useWidgetNodeId()
  function unGroupNode(node: BaseNode) {
    if (node.parent?.type === "GROUP") {
      figma.ungroup(node.parent);
    }
  }

  useStickable(async (e: WidgetStuckEvent) => {     
    async function getNode(id: string) {
      return await figma.getNodeByIdAsync(id);
    }

    async function handleOldHost(oldHostId: string) {
      const widgetNode = await getNode(widgetNodId);
      if (!widgetNode) return;

      const oldHost = await getNode(oldHostId);
      if (!oldHost) {
        widgetNode.remove();
        return;
      }

      if (groupingEnabled) {
        unGroupNode(widgetNode);
      }
    }

    async function handleNewHost(newHostId: string) {
      if (!groupingEnabled) return;

      const newHost = await getNode(newHostId);
      const widgetNode = await getNode(widgetNodId);
                  
      if (newHost && widgetNode) {
        const newHostParent = newHost.parent;
        if (newHostParent) {
          figma.group([newHost, widgetNode], newHostParent);
        }
      }
    }

    if (e.oldHostId) {
      await handleOldHost(e.oldHostId);
    }
    if (e.newHostId) {
      await handleNewHost(e.newHostId);
    }
  })

  useEffect(() => {
    if(beforeGroupingEnabled === groupingEnabled) return;
    setBeforeGroupingEnabled(groupingEnabled)

    if(groupingEnabled){
      figma.getNodeByIdAsync(widgetNodId).then(node => {
        if(node?.type === 'WIDGET' && node.stuckTo && node.parent){
          figma.group([node.stuckTo, node], node.parent);
        }
      })
    } else {
      figma.getNodeByIdAsync(widgetNodId).then(node => {
        if(node?.parent){
          unGroupNode(node);
        }
      })
    }
  })

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

const CountModeIcon = ({ countTarget }: { countTarget: CountTarget }) => {
  const iconSrc =
    countTarget === 'section'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8Z" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 10H21" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.63 18.342L8.82 13.638L4.116 11.828L19.5 4.5L10.63 18.342Z" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.25 13.25L8.816 13.638" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  return (
    <AutoLayout tooltip={countTarget === 'section' ? 'Counting items in section' : 'Counting selected items'}>
      <SVG src={iconSrc} width={16} height={16} />
    </AutoLayout>
  )
}

function CounterWidget({ counterSizeMode, countTarget }: { counterSizeMode: CounterSizeMode, countTarget: CountTarget }) {
  const [total, setTotal] = useSyncedState('total', 0)
  const [pointCounts, setPointCounts] = useSyncedState<{ [point: number]: number }>('pointCounts', {})
  const [showDetails, setShowDetails] = useSyncedState('showDetails', false)
  const [selectionInfo, setSelectionInfo] = useSyncedState('selectionInfo', 'Not selected')
  const widgetId = useWidgetNodeId()

  const calculateTotal = async () => {
    let selection: readonly SceneNode[]
    const widgetNode = await figma.getNodeByIdAsync(widgetId)

    if (countTarget === 'section') {
      if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
        selection = [widgetNode.parent]
        setSelectionInfo(`Section: ${widgetNode.parent.name}`)
      } else {
        figma.notify('This widget is not in a section.')
        return
      }
    } else {
      selection = figma.currentPage.selection
      // 選択がない場合、またはカウンターウィジェット自身のみが選択されている場合
      if (selection.length === 0 || (selection.length === 1 && selection[0].id === widgetId)) {
        if (widgetNode && widgetNode.parent && widgetNode.parent.type === 'SECTION') {
          selection = [widgetNode.parent]
          setSelectionInfo(`Section: ${widgetNode.parent.name}`)
        } else {
          setSelectionInfo('Not selected')
        }
      } else if (selection.length === 1 && selection[0].type === 'SECTION') {
        setSelectionInfo(`Section: ${selection[0].name}`)
      } else if (selection.length > 0) {
        setSelectionInfo('Selected Multiple')
      }
    }

    const pointWidgets: WidgetNode[] = getPointWidgetsFromSceneNodes(selection);

    if (pointWidgets.length === 0) {
      setTotal(0)
      setPointCounts({})
      figma.notify('No point widgets found in the selection or parent section.')
      return
    }

    const points = pointWidgets.map(widget => {
      const point = widget.widgetSyncedState['point']
      if (typeof point === 'number') {
        return point
      }
      return 0
    });

    const total = points.reduce((acc, curr) => acc + curr, 0)
    setTotal(total)

    // ポイント値ごとに件数を集計
    const counts = points.reduce<{ [point: number]: number }>((acc, point) => {
      acc[point] = (acc[point] || 0) + 1
      return acc
    }, {})
    setPointCounts(counts)
  }

  if (counterSizeMode === 'compact') {
    return (
      <AutoLayout
        verticalAlignItems={'center'}
        horizontalAlignItems={'center'}
        spacing={8}
        padding={{ vertical: 4, horizontal: 8 }}
        cornerRadius={8}
        fill={'#FFFFFF'}
        stroke={'#E0E0E0'}
        strokeWidth={1}
      >
        <CountModeIcon countTarget={countTarget} />
        <Text fontSize={18} fontWeight={700} fill={'#0066FF'}>{total}</Text>
        <Text fontSize={14} fontWeight={500} fill={'#495057'}>pts</Text>
        <AutoLayout
          onClick={calculateTotal}
          hoverStyle={{ fill: '#F0F0F0' }}
          cornerRadius={4}
          padding={4}
        >
          <SVG
            src={`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 2V8H8.5" stroke="#0066FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5 22V16H15.5" stroke="#0066FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.9999 8C21.7499 5.04167 20.4999 3.58333 17.4999 2.5L8.49994 2.5" stroke="#0066FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.00006 16C2.25006 18.9583 3.50006 20.4167 6.50006 21.5L15.5001 21.5" stroke="#0066FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
            width={16}
            height={16}
          />
        </AutoLayout>
      </AutoLayout>
    )
  }

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems={'center'}
      spacing={12}
      padding={20}
      cornerRadius={12}
      fill={'#FFFFFF'}
      stroke={'#E0E0E0'}
      strokeWidth={1}
      direction="vertical"
      width={280}
    >
      <AutoLayout horizontalAlignItems={'center'} spacing={8}>
        <CountModeIcon countTarget={countTarget} />
        <Text fontSize={28} fontWeight={700} fill={'#1A1A1A'}>Point Counter</Text>
      </AutoLayout>
      <Text fontSize={14} fill={'#6C757D'}>{selectionInfo}</Text>
      
      <AutoLayout 
        verticalAlignItems={'center'} 
        spacing={8}
        padding={12}
        cornerRadius={8}
        fill={'#F8F9FA'}
        stroke={'#E9ECEF'}
        strokeWidth={1}
      >
        <Text fontSize={18} fontWeight={500} fill={'#495057'}>Total:</Text>
        <Text fontSize={24} fontWeight={700} fill={'#0066FF'}>{total}</Text>
        <Text fontSize={18} fontWeight={500} fill={'#495057'}>points</Text>
      </AutoLayout>

      {/* 詳細開閉トグルボタン */}
      <AutoLayout padding={0} spacing={8}>
        <Text
          fontSize={14}
          fill={'#0066FF'}
          onClick={() => setShowDetails(!showDetails)}
          fontWeight={600}
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </Text>
      </AutoLayout>

      {/* ポイント値ごとの件数リスト */}
      {showDetails && Object.keys(pointCounts).length > 0 && (
        <AutoLayout direction="vertical" spacing={0} padding={8} fill={'#F4F4F4'} cornerRadius={6} width={'fill-parent'}>
          <Text fontSize={16} fontWeight={600} fill={'#333'}>Points breakdown:</Text>
          {Object.keys(pointCounts)
            .sort((a, b) => Number(a) - Number(b))
            .map((point, idx, arr) => (
              <>
                <AutoLayout key={point} direction="horizontal" width={'fill-parent'} padding={{ vertical: 8, horizontal: 4 }}>
                  <Text fontSize={15} fontWeight={700} fill={'#222'} width={"fill-parent"}>{point} pt</Text>
                  <Text fontSize={15} fill={'#0066FF'}>{pointCounts[Number(point)]} items</Text>
                </AutoLayout>
                {idx < arr.length - 1 && (
                  <AutoLayout width={'fill-parent'} height={1} fill={'#E0E0E0'} />
                )}
              </>
            ))}
        </AutoLayout>
      )}
      
      <AutoLayout horizontalAlignItems={'center'} width="fill-parent">
        <AutoLayout
          stroke={'#0066FF'}
          fill={'#0066FF'}
          cornerRadius={8}
          padding={10}
          width={100}
          height={40}
          verticalAlignItems={'center'}
          horizontalAlignItems={'center'}
          onClick={calculateTotal}
        >
          <Text fontSize={16} fontWeight={600} fill={'#FFFFFF'}>Count</Text>
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
  if ("children" in node) {
    node.children.forEach(child => {
      pointWidgets.push(...getPointWidgets(child));
    });
  }

  if ("stuckNodes" in node) {
    node.stuckNodes.forEach(stuckNode => {
      pointWidgets.push(...getPointWidgets(stuckNode));
    })
  }

  return pointWidgets;
}
