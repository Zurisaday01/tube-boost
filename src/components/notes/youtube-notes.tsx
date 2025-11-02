'use client';

import React, { useRef, useState } from 'react';
import YouTube, {
  YouTubeEvent,
  YouTubePlayer,
  YouTubeProps
} from 'react-youtube';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ClientRichNoteEditor } from './client-rich-note-editor';
import { BlockNoteEditor } from '@blocknote/core';
import { TimestampedContent } from '@/types/notes';
import { savePlaylistVideoNote } from '@/lib/actions/playlist-video-note';
import ResizableYouTubePlayer from './resizable-youtube-player';

interface YouTubeNotesProps {
  playlistVideoId: string;
  videoId: string;
  initialEditorContent: BlockNoteEditor['document'] | null;
  onVideoLoad: () => void;
}

const normalizeDocument = (doc: BlockNoteEditor['document'] | null) => {
  if (!doc) return [];

  // Copy to avoid mutating the original
  const cleaned = [...doc];

  // Remove only trailing empty paragraphs
  while (
    cleaned.length > 0 &&
    cleaned[cleaned.length - 1].type === 'paragraph' &&
    (!cleaned[cleaned.length - 1].content ||
      (Array.isArray(cleaned[cleaned.length - 1].content) &&
        (cleaned[cleaned.length - 1].content as unknown[]).length === 0))
  ) {
    cleaned.pop();
  }

  return cleaned;
};

// Single big note with timestamps inside it
// Timestamps will be added inside the note, and clicking them will jump to that time in the video
export default function YouTubeNotes({
  playlistVideoId,
  videoId, // NOTE: External YouTube video ID from YouTube API
  initialEditorContent,
  onVideoLoad
}: YouTubeNotesProps) {
  const [isNoteEmpty, setIsNoteEmpty] = useState(true);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [timestampedNotes, setTimestampedNotes] = useState<
    TimestampedContent[]
  >([]);
  const [isNoteTakingReady, setIsNoteTakingReady] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<
    BlockNoteEditor['document'] | null
  >(null);

  const sortedTimestampedNotes = [...timestampedNotes].sort(
    (a, b) => a.time - b.time
  );

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    // This is to hide the loading spinner in the parent component
    onVideoLoad();
  };

  const addNote = async () => {
    if (!playerRef.current) return;
    const currentTime = await playerRef.current.getCurrentTime();

    // Check if there's already a note within ±1 second
    const exists = timestampedNotes.some(
      (note) => Math.abs(note.time - currentTime) < 1
    );

    if (exists) {
      toast.info('You already have a note at this timestamp!');
      return;
    }

    setTimestampedNotes((prev) => [
      ...prev,
      {
        time: currentTime,
        content: undefined // start empty
      }
    ]);
    //
  };

  const jumpTo = async (time: number) => {
    if (!playerRef.current) return;
    await playerRef.current.seekTo(time, true);
  };

  // when the video plays/pauses, update isNoteTakingReady state
  // if state is 1 (playing) or 2 (paused), set isNoteTakingReady to true, else false (-1=unstarted, 1=playing, 0=ended, 2=paused, 3=buffering, 5=cued)
  const onStateChange = (event: YouTubeEvent) => {
    setIsNoteTakingReady(
      event.target.getPlayerState() === 1 || event.target.getPlayerState() === 2
    );
  };

  const handleCheckEmpty = (content: BlockNoteEditor['document']) => {
    // Check if content is empty (no blocks or only one empty paragraph block)
    const isEmpty =
      content.length === 0 ||
      (content.length === 1 &&
        content[0].type === 'paragraph' &&
        (content[0].content === undefined ||
          (Array.isArray(content[0].content) &&
            content[0].content.length === 0)));
    setIsNoteEmpty(isEmpty);
  };

  const handleChange = (content: BlockNoteEditor['document']) => {
    setCurrentDocument(content); // always store the latest
    handleCheckEmpty(content);
  };

  const handleSaveNote = async () => {
    if (!playerRef.current) return;

    // Convert the BlockNote editor content into JSON string
    const noteContent = JSON.stringify(currentDocument);

    if (
      JSON.stringify(normalizeDocument(currentDocument)) ===
      JSON.stringify(normalizeDocument(initialEditorContent))
    ) {
      toast.error('No changes to save.');
      return;
    }

    try {
      await savePlaylistVideoNote({
        playlistVideoId,
        document: noteContent
      });
      toast.success('Note saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save note.');
    }
  };

  return (
    <div className='flex w-full flex-col gap-4 md:flex-row'>
      <div>
        {/* YouTube Player */}
        {/* <YouTube
          videoId={videoId}
          onReady={onReady}
          onStateChange={onStateChange}
          opts={opts}
        /> */}
        <ResizableYouTubePlayer
          videoId={videoId}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>

      <div className='flex w-full flex-col gap-2'>
        {/* Add note at current time */}
        <div className='flex flex-col'>
          <Button
            onClick={addNote}
            variant='secondary'
            className='w-fit cursor-pointer'
            disabled={!isNoteTakingReady}
          >
            Add Note at Current Time
          </Button>
          {timestampedNotes.length === 0 &&
            !isNoteTakingReady &&
            !initialEditorContent && (
              <p className='text-muted-foreground mt-4 text-sm'>
                Click &quot;Add Note at Current Time&quot; to start referencing
                to specific timestamps in the video.
              </p>
            )}
        </div>

        {/* Notes Instance */}
        <ClientRichNoteEditor
          initialEditorContent={initialEditorContent}
          timestampsNotes={sortedTimestampedNotes as TimestampedContent[]}
          onChange={handleChange}
          jumpTo={jumpTo}
        />

        <Button
          className='self-start'
          disabled={isNoteEmpty}
          onClick={handleSaveNote}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
}
