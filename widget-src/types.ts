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
