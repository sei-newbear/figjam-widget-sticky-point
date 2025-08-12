export type WidgetType = 'point' | 'counter' | 'organizer' | 'stickyTagger'
export type Size = 'small' | 'medium' | 'large'
export type CounterSizeMode = 'normal' | 'compact'
export type CountTarget = 'manual' | 'section'

export type WidgetProps = {
  widgetType: WidgetType
  size: Size
  width: number
  backgroundColor: string
  textColor: string
  groupingEnabled: boolean
  counterSizeMode: CounterSizeMode
  countTarget: CountTarget
  enableExperimentalPreload: boolean
}

export type Tag = {
  id: string;
  templateWidgetId: string;
  label: string;
  backgroundColor: string;
  textColor: string;
  point: number;
};