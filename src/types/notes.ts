import { BlockNoteEditor } from '@blocknote/core';

export interface TimestampedContent {
  time: number;
  content: any;
}

export interface RichNoteEditor {
  initialEditorContent: BlockNoteEditor['document'] | null;
  timestampsNotes: TimestampedContent[];
  onChange?: (content: any) => void;
  editable?: boolean;
  jumpTo: (time: number) => void;
  onEditorLoad: () => void;
}
