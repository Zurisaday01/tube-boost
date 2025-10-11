export interface TimestampedContent {
  time: number;
  content: any;
}

export interface RichNoteEditor {
  initialContent: TimestampedContent[];
  onChange?: (content: any) => void;
  editable?: boolean;
  jumpTo: (time: number) => void;
}
