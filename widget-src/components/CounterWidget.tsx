
const { widget } = figma
const { useSyncedState, AutoLayout, Text, SVG, useWidgetNodeId } = widget
import { CounterSizeMode, CountTarget } from '../types'
import { getPointWidgetsFromSceneNodes } from '../utils'

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

export function CounterWidget({ counterSizeMode, countTarget }: { counterSizeMode: CounterSizeMode, countTarget: CountTarget }) {
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
