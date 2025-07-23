// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState, usePropertyMenu } = widget
import { WidgetType, Size, CounterSizeMode, CountTarget } from './types'
import { PointWidget } from './components/PointWidget'
import { CounterWidget } from './components/CounterWidget'

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

widget.register(Widget)