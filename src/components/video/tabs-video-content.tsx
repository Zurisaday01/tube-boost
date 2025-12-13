'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import YouTubeNotes from '../notes/youtube-notes';
import YouTubeTimestampsList from '../notes/youtube-timestamps-list';
import { BlockNoteEditor } from '@blocknote/core';

interface TabsVideoContentProps {
  youtubeVideoId: string;
  playlistVideoId: string;
  initialEditorContent: BlockNoteEditor['document'] | null;
  simpleTimestamps: number[];
  handleLoad: () => void;
  onTimestampsSaved: (timestamps: number[]) => void;
}

const TabsVideoContent = ({
  youtubeVideoId,
  playlistVideoId,
  initialEditorContent,
  simpleTimestamps,
  handleLoad,
  onTimestampsSaved
}: TabsVideoContentProps) => {
  return (
    <Tabs defaultValue='note-taking' className='w-full'>
      <TabsList>
        <TabsTrigger value='note-taking'>Note Taking Mode</TabsTrigger>
        <TabsTrigger value='listening'>Listening Mode</TabsTrigger>
      </TabsList>
      <TabsContent
        value='note-taking'
        forceMount
        className='data-[state=inactive]:hidden'
      >
        <div className='w-full'>
          <YouTubeNotes
            initialEditorContent={initialEditorContent}
            playlistVideoId={playlistVideoId}
            videoId={youtubeVideoId}
            onEditorLoad={handleLoad}
            onTimestampsSaved={onTimestampsSaved}
          />
        </div>
      </TabsContent>
      <TabsContent
        value='listening'
        forceMount
        className='data-[state=inactive]:hidden'
      >
        <div className='w-full'>
          <YouTubeTimestampsList
            timestamps={simpleTimestamps}
            videoId={youtubeVideoId}
            onLoad={handleLoad}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
export default TabsVideoContent;
