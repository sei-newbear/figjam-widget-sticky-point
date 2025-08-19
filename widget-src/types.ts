export type WidgetType = 'point' | 'counter' | 'organizer' | 'stickyTagger'
export type Size = 'small' | 'medium' | 'large'
export type CounterSizeMode = 'normal' | 'compact'
export type StickyTaggerSizeMode = 'normal' | 'compact'
export type CountTarget = 'manual' | 'section'

export type Tag = {
  id: string;
  label: string;
  templateWidgetId: string;
  point: number;
  backgroundColor?: string;
  textColor?: string;
};

export type PointWidget = WidgetNode & {
  widgetId: string;
  name: string;
  getWidgetProperty: (name: string) => any;
};

export type GroupingRule = {
  pointRange: [number, number];
  color: string;
};

export type GroupingResult = {
  groupName: string;
  color: string;
  widgets: WidgetNode[];
  totalPoints: number;
};
