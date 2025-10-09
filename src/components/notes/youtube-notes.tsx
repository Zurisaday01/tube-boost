'use client';

import '@blocknote/mantine/blocknoteStyles.css';

import React, { useRef, useState } from 'react';
import YouTube, { YouTubeEvent, YouTubePlayer } from 'react-youtube';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ClientRichNoteEditor } from './client-rich-note-editor';

interface TimestampedContent {
  time: number;
  content: any;
}

interface YouTubeNotesProps {
  videoId: string;
}

// Single big note with timestamps inside it
// Timestamps will be added inside the note, and clicking them will jump to that time in the video
// Timestamps will be added in a sorted manner (timestampedNote)

export default function YouTubeNotes({ videoId }: YouTubeNotesProps) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [timestampedNotes, setTimestampedNote] = useState<TimestampedContent[]>(
    []
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const sortedTimestampedNotes = timestampedNotes.sort(
    (a, b) => a.time - b.time
  );

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
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

    setTimestampedNote((prev) => [
      ...prev,
      {
        time: currentTime,
        content: undefined // start empty
      }
    ]);
    //
  };

  // const updateNote = (index: number, content: any) => {
  //   setTimestampedNote((prev) =>
  //     prev.map((note, i) => (i === index ? { ...note, content } : note))
  //   );
  // };

  const jumpTo = async (time: number) => {
    if (!playerRef.current) return;
    await playerRef.current.seekTo(time, true);
  };

  // when the video plays/pauses, update isPlaying state
  // if state is 1 (playing) or 2 (paused), set isPlaying to true, else false (-1=unstarted, 1=playing, 0=ended, 2=paused, 3=buffering, 5=cued)
  const onStateChange = (event: YouTubeEvent) => {
    setIsPlaying(
      event.target.getPlayerState() === 1 || event.target.getPlayerState() === 2
    );
  };

  return (
    <div className='flex w-full flex-col gap-4 md:flex-row'>
      <div>
        {/* YouTube Player */}
        <YouTube
          videoId={videoId}
          onReady={onReady}
          onStateChange={onStateChange}
          opts={{
            width: '640',
            height: '360',
            playerVars: { modestbranding: 1 }
          }}
        />
      </div>

      <div className='flex w-full flex-col gap-2'>
        {/* Add note at current time */}
        <div className='flex flex-col'>
          <Button onClick={addNote} className='w-fit' disabled={!isPlaying}>
            Add Note at Current Time
          </Button>
          {timestampedNotes.length === 0 && (
            <p className='text-muted-foreground mt-4 text-sm'>
              Click &quot;Add Note at Current Time&quot; to start referencing to
              specific timestamps in the video.
            </p>
          )}
        </div>

        {/* Notes Instance */}
        <ClientRichNoteEditor
          initialContent={sortedTimestampedNotes as TimestampedContent[]}
          onChange={(content) => console.log('All Notes Content:', content)}
          jumpTo={jumpTo}
        />

        <Button className='self-start'> Save Note</Button>
      </div>
    </div>
  );
}
