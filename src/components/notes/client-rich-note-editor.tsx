'use client';

import type { RichNoteEditor as ClientRichNoteEditorProps } from '@/lib/types/notes';
import dynamic from 'next/dynamic';

// Dynamically import the editor to avoid SSR
const RichNoteEditorComponent = dynamic(() => import('./rich-note-editor'), {
  ssr: false
});

export function ClientRichNoteEditor(props: ClientRichNoteEditorProps) {
  return <RichNoteEditorComponent {...props} />;
}
