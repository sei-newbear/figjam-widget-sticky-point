
const { widget } = figma
const { useSyncedState, AutoLayout, Input } = widget
import { Size } from '../types'
import { usePointWidget } from '../hooks/usePointWidget'
import { sizeConfig } from '../config'

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
