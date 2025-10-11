'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

import { BlockNoteEditor, BlockNoteSchema } from '@blocknote/core';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import createTimestamp from './timestamp';
import type { RichNoteEditor } from '@/lib/types/notes';

type RichNoteEditorProps = RichNoteEditor;

function RichNoteEditor({
  initialContent,
  onChange,
  editable = true,
  jumpTo
}: RichNoteEditorProps) {
  // Our schema with block specs, which contain the configs and implementations for
  // blocks that we want our editor to use.
  const schema = BlockNoteSchema.create().extend({
    blockSpecs: {
      // Creates an instance of the Timestamp block and adds it to the schema.
      timestamp: createTimestamp(jumpTo)()
    }
  });

  const editor = useCreateBlockNote({ schema });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // mark that we are on client
  }, []);

  // Whenever the content changes, notify parent
  const handleEditorChange = (editor: BlockNoteEditor) => {
    if (onChange) onChange(editor.document);
  };

  // Insert timestamps into the editor
  const handleInsertTimestamps = useCallback(() => {
    if (!editor || !initialContent) return;

    const sorted = [...initialContent].sort((a, b) => a.time - b.time);

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
      editor.insertBlocks(newBlocks as any[], lastBlock.id, 'after');
    } else {
      editor.replaceBlocks(editor.document, newBlocks as any[]);
    }
  }, [editor, initialContent]);

  // Run once on mount or when initialContent changes
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
