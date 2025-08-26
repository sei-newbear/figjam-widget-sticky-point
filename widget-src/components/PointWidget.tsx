
const { widget } = figma
const { useSyncedState, AutoLayout, Input } = widget
import { Size } from '../types'
import { usePointWidget } from '../hooks/usePointWidget'

// サイズ設定を定義
export const sizeConfig: Record<Size, {
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

export function PointWidget({ size, backgroundColor, textColor, width, groupingEnabled }: { size: Size; backgroundColor: string; textColor: string; width: number; groupingEnabled: boolean }) {
  const [point, setPoint] = useSyncedState<number>('point', 0)
  usePointWidget(groupingEnabled)

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
        onTextEditEnd={(e: TextEditEvent) => {
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
