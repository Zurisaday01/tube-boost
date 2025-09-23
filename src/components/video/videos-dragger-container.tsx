'use client';
import { PlaylistVideo } from '@/types';
import VideoList from './video-list';
import { Button } from '../ui/button';
import { useState } from 'react';
import { reorderPlaylistVideos } from '@/lib/actions/video';
import { toast } from 'sonner';

interface VideosDraggerContainerProps {
  videos: PlaylistVideo[];
  subcategoryId?: string;
}

const VideosDraggerContainer = ({ videos }: VideosDraggerContainerProps) => {
  const [reorderMode, setReorderMode] = useState(false);

  const toggleReorderMode = async () => {
    if (reorderMode) {
      // We're finishing reordering, save changes
      try {
        const response = await reorderPlaylistVideos({
          playlistId: currentVideos[0]?.playlistId,
          videoIds: currentVideos.map((v) => v.id)
        });
        if (!response.success) {
          toast.error(response.error || 'Failed to reorder videos.');
          return;
        }
        toast.success('Videos reordered successfully!');
      } catch (err) {
        console.error('Failed to save new order', err);
        toast.error('Failed to reorder videos.');
      }
    }

    // Toggle mode after saving (or just enter mode)
    setReorderMode((prev) => !prev);
  };

  const [currentVideos, setCurrentVideos] = useState(videos);

  const handleReorder = async (newOrder: PlaylistVideo[]) => {
    // reorder the videos locally
    const reordered = newOrder.map((v, index) => ({
      ...v,
      orderIndex: index
    }));
    // update state
    setCurrentVideos(reordered);
  };

  return (
    <div>
      {/* disable the button if there are no videos or only one video */}
      <Button
        onClick={toggleReorderMode}
        disabled={videos.length === 0 || videos.length === 1}
        className='mb-4'
      >
        {reorderMode ? 'Finish Reordering' : 'Reorder Videos'}
      </Button>
      <VideoList
        videos={currentVideos as PlaylistVideo[]}
        reorderMode={reorderMode}
        onReorder={handleReorder}
      />
    </div>
  );
};
export default VideosDraggerContainer;
