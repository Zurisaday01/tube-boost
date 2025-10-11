'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

import { BlockNoteEditor, BlockNoteSchema } from '@blocknote/core';
import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import createTimestamp from './timestamp';
import type { RichNoteEditor as RichNoteEditorProps } from '@/lib/types/notes';

function RichNoteEditor({
  timestampsNotes,
  initialEditorContent,
  onChange,
  editable = true,
  jumpTo
}: RichNoteEditorProps) {
  const [mounted, setMounted] = useState(false);
  // gard against multiple inserts of the initial editor content
  const hasInsertedRef = useRef(false);

  // Our schema with block specs, which contain the configs and implementations for
  // blocks that we want our editor to use.
  const schema = BlockNoteSchema.create().extend({
    blockSpecs: {
      // Creates an instance of the Timestamp block and adds it to the schema.
      timestamp: createTimestamp(jumpTo)()
    }
  });

  const editor = useCreateBlockNote({ schema });

  useEffect(() => {
    setMounted(true); // mark that we are on client
  }, []);

  useEffect(() => {
    // when initial content is set, update the editor
    if (initialEditorContent && editor && !hasInsertedRef.current) {
      // Use queueMicrotask to ensure this runs after the current call stack
      queueMicrotask(() => {
        // get the document id of the last block
        const lastBlock = editor.document[editor.document.length - 1];
        editor.insertBlocks(initialEditorContent, lastBlock.id, 'before');
        hasInsertedRef.current = true;
      });
    }
  }, [editor, initialEditorContent]);

  // Whenever the content changes, notify parent
  const handleEditorChange = (editor: BlockNoteEditor) => {
    if (onChange) onChange(editor.document);
  };

  // Insert timestamps into the editor
  const handleInsertTimestamps = useCallback(() => {
    if (!editor || !timestampsNotes) return;

    const sorted = [...timestampsNotes].sort((a, b) => a.time - b.time);

    // Collect all existing timestamp values from the editor blocks
    const existingTimes = editor.document
      .filter((block) => block.type === 'timestamp')
      .map((block) => block.props.time);

    // Filter out timestamps that are already present
    const newBlocks = sorted
      .filter((note) => !existingTimes.includes(note.time))
      .map((note) => ({
        type: 'timestamp',
        props: { time: note.time }
      }));

    if (newBlocks.length === 0) return;

    // Always insert after the last empty block
    const lastBlock = editor.document[editor.document.length - 1];
    const lastBlockContent = lastBlock?.content;

    const isLastBlockEmpty =
      lastBlockContent !== undefined &&
      Array.isArray(lastBlockContent) &&
      lastBlockContent.length === 0;

    if (isLastBlockEmpty && lastBlock.type === 'paragraph') {
      editor.insertBlocks(newBlocks as any[], lastBlock.id, 'before');
    } else {
      editor.insertBlocks(newBlocks as any[], lastBlock.id, 'after');
    }
  }, [editor, timestampsNotes]);

  // Run once on mount or when timestampsNotes changes
  useEffect(() => {
    queueMicrotask(() => handleInsertTimestamps());
  }, [handleInsertTimestamps]);

  // Only render editor on client
  if (!mounted) return null;

  return (
    <div className='rounded-md border border-gray-300'>
      <BlockNoteView
        theme='light'
        className='min-h-[200px] p-3'
        editor={editor as BlockNoteEditor}
        onChange={handleEditorChange}
        editable={editable}
      />
    </div>
  );
}

export default RichNoteEditor;
