'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';

import { BlockNoteEditor } from '@blocknote/core';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';

interface TimestampedContent {
  time: number;
  content: any;
}

interface RichNoteEditorProps {
  initialContent: TimestampedContent[];
  onChange?: (content: any) => void;
  editable?: boolean;
}
function RichNoteEditor({
  initialContent,
  onChange,
  editable = true,
  jumpTo
}: RichNoteEditorProps & { jumpTo?: (time: number) => void }) {
  const editor = useCreateBlockNote();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // mark that we are on client
  }, []);

  // Whenever the content changes, notify parent
  const handleEditorChange = (editor: BlockNoteEditor) => {
    if (onChange) onChange(editor.document);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Insert timestamps into the editor
  // Insert timestamps into the editor
  const handleInsertTimestamps = useCallback(() => {
    if (!editor || !initialContent) return;

    const sorted = [...initialContent].sort((a, b) => a.time - b.time);

    // 1. Get the current text content of all blocks in the editor
    const existingBlockTexts = editor.document.map((block) => {
      // Block content can be complex (array of text, links, etc.).
      // This crude conversion is often sufficient for simple checks.
      if (block.content) {
        return (block.content as any[])
          .map(
            (item) => item.text || (item.content && item.content[0]?.text) || ''
          )
          .join('');
      }
      return '';
    });

    // 2. Identify and filter out timestamps that are already present
    const uniqueNewTimestamps = sorted.filter((note) => {
      const formattedTime = formatTime(note.time);
      // Check if the formatted time string is contained in any existing block text
      return !existingBlockTexts.some((text) => text.includes(formattedTime));
    });

    // need to have any due to type mismatch
    const newBlocks: any[] = [];

    // 3. Create blocks only for the unique, new timestamps
    uniqueNewTimestamps.forEach((note) => {
      const blockContent = [
        {
          type: 'link',
          href: '#',
          content: [
            {
              type: 'text',
              text: formatTime(note.time),
              styles: { bold: true, textColor: 'red' }
            }
          ]
        }
      ];

      newBlocks.push({
        type: 'paragraph',
        content: blockContent
      });
    });

    // If there are no new blocks, stop here
    if (newBlocks.length === 0) return;

    // 4. Insert the new blocks
    const documentBlocks = editor.document;
    const referenceBlockId =
      documentBlocks.length > 0
        ? documentBlocks[documentBlocks.length - 1].id
        : undefined;

    if (referenceBlockId) {
      editor.insertBlocks(newBlocks, referenceBlockId, 'after');
    } else {
      editor.replaceBlocks(editor.document, newBlocks);
    }
  }, [editor, initialContent]);

  // Run once on mount or when initialContent changes
  useEffect(() => {
    handleInsertTimestamps();
  }, [handleInsertTimestamps]);

  // Only render editor on client
  if (!mounted) return null;

  return (
    <div className='rounded-md border border-gray-300'>
      <BlockNoteView
        theme='light'
        className='min-h-[200px] p-3'
        editor={editor}
        onChange={handleEditorChange}
        editable={editable}
      />
    </div>
  );
}

export default RichNoteEditor;
