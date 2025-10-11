'use client';

import type { RichNoteEditor } from '@/lib/types/notes';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR
const RichNoteEditor = dynamic(() => import('./rich-note-editor'), {
  ssr: false
});

type ClientRichNoteEditorProps = RichNoteEditor;

export function ClientRichNoteEditor(props: ClientRichNoteEditorProps) {
  return <RichNoteEditor {...props} />;
}
