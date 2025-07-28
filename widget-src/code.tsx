// This is a widget that can be either a "Point" counter or a "Counter" that sums up all points.

const { widget } = figma
const { useSyncedState } = widget
import { WidgetType, Size, CounterSizeMode, CountTarget } from './types'
import { PointWidget } from './components/PointWidget'
import { CounterWidget } from './components/CounterWidget'
import { OrganizerWidget } from './components/OrganizerWidget'
import { useWidgetPropertyMenu } from './hooks/useWidgetPropertyMenu'

function Widget() {
  const [widgetType, setWidgetType] = useSyncedState<WidgetType>('widgetType', 'point')
  const [size, setSize] = useSyncedState<Size>('size', 'small')
  const [backgroundColor, setBackgroundColor] = useSyncedState<string>('backgroundColor', '#FFFFFF')
  const [textColor, setTextColor] = useSyncedState<string>('textColor', '#000000')
  const [width, setWidth] = useSyncedState<number>('width', 72)
  const [counterSizeMode, setCounterSizeMode] = useSyncedState<CounterSizeMode>('counterSizeMode', 'normal')
  const [countTarget, setCountTarget] = useSyncedState<CountTarget>('countTarget', 'manual')
  const [groupingEnabled, setGroupingEnabled] = useSyncedState<boolean>('groupingEnabled', false)

  useWidgetPropertyMenu(
    widgetType,
    size,
    width,
    backgroundColor,
    textColor,
    groupingEnabled,
    counterSizeMode,
    countTarget,
    setWidgetType,
    setSize,
    setWidth,
    setBackgroundColor,
    setTextColor,
    setGroupingEnabled,
    setCounterSizeMode,
    setCountTarget
  )

  if (widgetType === 'point') {
    return <PointWidget size={size} backgroundColor={backgroundColor} textColor={textColor} width={width} groupingEnabled={groupingEnabled} />
  } else if (widgetType === 'counter') {
    return <CounterWidget counterSizeMode={counterSizeMode} countTarget={countTarget} />
  } else if (widgetType === 'organizer') {
    return <OrganizerWidget />
  }
}

widget.register(Widget)
