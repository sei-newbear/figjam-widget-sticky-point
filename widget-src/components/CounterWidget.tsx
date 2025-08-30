
const { widget } = figma
const { AutoLayout, Text, SVG } = widget
import { CounterSizeMode, CountTarget } from '../types'
import { useCounterWidget } from '../hooks/useCounterWidget'

const CountModeIcon = ({ countTarget }: { countTarget: CountTarget }) => {
  const iconSrc = 
    countTarget === 'linked_section'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.19 8.68994C13.19 8.68994 15.04 7.44994 16.5 8.90994C17.96 10.37 16.72 12.22 16.72 12.22L12.22 16.72C12.22 16.72 10.37 17.96 8.91 16.5C7.45 15.04 8.69 13.19 8.69 13.19L13.19 8.68994Z" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.69006 8.68994L7.23006 7.22994C5.77006 5.76994 3.35006 6.14994 2.50006 7.94994C1.65006 9.74994 2.73006 11.8199 4.19006 12.9199L5.44006 13.8199" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.31 15.31L16.77 16.77C18.23 18.23 20.65 17.85 21.5 16.05C22.35 14.25 21.27 12.18 19.81 11.08L18.56 10.18" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : countTarget === 'section'
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 8V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8Z" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 10H21" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.63 18.342L8.82 13.638L4.116 11.828L19.5 4.5L10.63 18.342Z" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.25 13.25L8.816 13.638" stroke="#6C757D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  const tooltip = 
    countTarget === 'linked_section'
      ? 'Counting items in a linked section'
      : countTarget === 'section'
        ? 'Counting items in parent section'
        : 'Counting selected items'

  return (
    <AutoLayout tooltip={tooltip}>
      <SVG src={iconSrc} width={16} height={16} />
    </AutoLayout>
  )
}

export function CounterWidget({ counterSizeMode, countTarget }: { counterSizeMode: CounterSizeMode, countTarget: CountTarget }) {
  const { total, pointCounts, showDetails, selectionInfo, setShowDetails, calculateTotal, handleLinkSection } = useCounterWidget(countTarget)

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

      {countTarget === 'linked_section' && (
        <AutoLayout
          padding={8}
          cornerRadius={8}
          fill={'#F0F0F0'}
          stroke={'#E0E0E0'}
          strokeWidth={1}
          horizontalAlignItems={'center'}
          verticalAlignItems={'center'}
          spacing={8}
          onClick={handleLinkSection}
          hoverStyle={{ fill: '#E6F7FF' }}
          width={'hug-contents'}
        >
          <Text fontSize={14} fontWeight={600} fill={'#0066FF'}>
            🔗 Link to selected section
          </Text>
        </AutoLayout>
      )}
      
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
