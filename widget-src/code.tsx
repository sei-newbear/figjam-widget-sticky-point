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
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      stroke={'#E6E6E6'}
    >
      <SVG
        src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="15" fill="white"/>
        <rect x="7.5" y="14.0625" width="15" height="1.875" fill="black" fill-opacity="0.8"/>
        <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="black" stroke-opacity="0.1"/>
        </svg>`}
        onClick={() => {
          setCount(count - 1)
        }}
      ></SVG>
      <Input
        value={String(count)}
        placeholder="0"
        onTextEditEnd={(e) => {
          const newValue = parseInt(e.characters, 10)
          if (!isNaN(newValue)) {
            setCount(newValue)
          }
        }}
        fontSize={32}
        width={60}
        horizontalAlignText={'center'}
      />
      <SVG
        src={`<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="30" rx="15" fill="white"/>
        <path d="M15.9375 7.5H14.0625V14.0625H7.5V15.9375H14.0625V22.5H15.9375V15.9375H22.5V14.0625H15.9375V7.5Z" fill="black" fill-opacity="0.8"/>
        <rect x="0.5" y="0.5" width="29" height="29" rx="14.5" stroke="black" stroke-opacity="0.1"/>
        </svg>`}
        onClick={() => {
          setCount(count + 1)
        }}
      ></SVG>
    </AutoLayout>
  )
}

function CounterWidget() {
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
      <Text fontSize={32}>10</Text>
    </AutoLayout>
  )
}

widget.register(Widget)