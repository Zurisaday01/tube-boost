'use client';

import dynamic from 'next/dynamic';

interface TimestampedContent {
  time: number;
  content: any;
}

interface RichNoteEditorProps {
  initialContent: TimestampedContent[];
  onChange?: (content: any) => void;
  editable?: boolean;
  jumpTo: (time: number) => void;
}

// Dynamically import the editor to avoid SSR
const RichNoteEditor = dynamic(() => import('./rich-note-editor'), {
  ssr: false
});

export function ClientRichNoteEditor(props: RichNoteEditorProps) {
  return <RichNoteEditor {...props} />;
}
