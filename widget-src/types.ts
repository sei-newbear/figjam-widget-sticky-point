export type WidgetType = 'point' | 'counter' | 'organizer' | 'stickyTagger'
export type Size = 'small' | 'medium' | 'large'
export type CounterSizeMode = 'normal' | 'compact'
export type StickyTaggerSizeMode = 'normal' | 'compact'
export type CountTarget = 'manual' | 'section'

export type PointTemplate = {
  id: string;
  label: string;
  point: number;
  backgroundColor?: string;
  textColor?: string;
  size: Size;
  groupingEnabled: boolean;
  inputWidth: number;
  layoutWidth: number;
  layoutHeight: number;
};

export type PointWidgetProps = {
  id?: string;
  point?: number;
  label?: string;
  backgroundColor?: string;
  textColor?: string;
  size?: Size;
  groupingEnabled?: boolean;
  widgetType: WidgetType;
  width?: number;
};

export type CounterWidgetProps = {
  id: string;
  label: string;
  countTarget: CountTarget;
  targetId: string | null;
  sizeMode: CounterSizeMode;
  widgetType: WidgetType;
};

export type OrganizerWidgetProps = {
  id: string;
  widgetType: WidgetType;
};

export type StickyTaggerWidgetProps = {
  id: string;
  widgetType: WidgetType;
  sizeMode: StickyTaggerSizeMode;
};

