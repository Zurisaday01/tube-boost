'use client';
import '@blocknote/core/fonts/inter.css';
import { BlockNoteView } from '@blocknote/shadcn';
import { useCreateBlockNote } from '@blocknote/react';
import '@blocknote/shadcn/style.css';

import { BlockNoteEditor, BlockNoteSchema } from '@blocknote/core';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import createTimestamp from './timestamp';
import type { RichNoteEditor as RichNoteEditorProps } from '@/types/notes';
import { useTheme } from 'next-themes';

function RichNoteEditor({
  timestampsNotes,
  initialEditorContent,
  onChange,
  editable = true,
  jumpTo,
  onEditorLoad
}: RichNoteEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  // Our schema with block specs, which contain the configs and implementations for
  // blocks that we want our editor to use.
  const schema = useMemo(
    () =>
      BlockNoteSchema.create().extend({
        blockSpecs: {
          timestamp: createTimestamp(jumpTo)()
        }
      }),
    [jumpTo]
  );

  const editor = useCreateBlockNote({
    schema,
    initialContent: initialEditorContent ?? undefined
  });

  // Whenever the content changes, notify parent
  const handleEditorChange = (editor: BlockNoteEditor) => {
    if (onChange) {
      // Notify parent component of the updated document
      onChange(editor.document);
    }
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!editor?.document?.length) return;
    setReady(true);
  }, [editor.document]);

  useEffect(() => {
    if (!ready) return;

    // Insert timestamps after current call stack
    queueMicrotask(() => {
      handleInsertTimestamps();
    });

    onEditorLoad();
  }, [ready, handleInsertTimestamps, onEditorLoad]);

  // Run once on mount or when timestampsNotes changes
  // useEffect(() => {
  //   queueMicrotask(() => handleInsertTimestamps());
  // }, [handleInsertTimestamps]);

  // Only render editor on client
  if (!mounted) return null;

  // bg-[#1F1F1F] was added to fill container background in dark mode for the specific editior background color
  return (
    <div className='rounded-md border border-gray-300 dark:bg-[#1F1F1F] dark:border-neutral-600'>
      <BlockNoteView
        theme={theme === 'light' ? 'light' : 'dark'}
        className='min-h-[200px] p-3'
        editor={editor as BlockNoteEditor}
        onChange={handleEditorChange}
        editable={editable}
      />
    </div>
  );
}

export default RichNoteEditor;
