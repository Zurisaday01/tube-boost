'use client';
import { PlaylistVideo } from '@/types';
import VideoList from './video-list';
import { Button } from '../ui/button';
import { useState } from 'react';
import {
  reorderPlaylistVideos,
  reorderUncategorizedVideos
} from '@/lib/actions/video';
import { toast } from 'sonner';
import { handleActionResponse } from '@/lib/utils';

interface VideosDraggerContainerProps {
  videos: PlaylistVideo[];
  subcategoryId?: string; // stays null when uncategorized videos
}

const VideosDraggerContainer = ({
  videos,
  subcategoryId
}: VideosDraggerContainerProps) => {
  const [reorderMode, setReorderMode] = useState(false);
  const [currentVideos, setCurrentVideos] = useState(videos);
  const [originalVideos, setOriginalVideos] = useState<PlaylistVideo[]>([]);

  const toggleReorderMode = async () => {
    if (reorderMode) {
      // finishing reorder
      const originalOrder = originalVideos.map((v) => v.id);
      const currentOrder = currentVideos.map((v) => v.id);

      const hasChanged = !originalOrder.every(
        (id, i) => id === currentOrder[i]
      );

      if (!hasChanged) {
        toast.info('No changes detected.');
        setReorderMode(false);
        return;
      }

      try {
        const response = subcategoryId
          ? await reorderPlaylistVideos({
              playlistId: currentVideos[0]?.playlistId,
              videoIds: currentVideos.map((v) => v.id)
            })
          : await reorderUncategorizedVideos({
              playlistId: currentVideos[0]?.playlistId,
              videoIds: currentVideos.map((v) => v.id)
            });

        handleActionResponse(response);
      } catch (err) {
        console.error('Failed to save new order', err);
        toast.error('Failed to reorder videos.');
      }
    } else {
      // entering reorder mode
      setOriginalVideos(currentVideos);
    }

    setReorderMode((prev) => !prev);
  };

  const handleReorder = (newOrder: PlaylistVideo[]) => {
    const reordered = newOrder.map((v, index) => ({
      ...v,
      orderIndex: index
    }));
    setCurrentVideos(reordered);
  };

  return (
    <div>
      <Button
        onClick={toggleReorderMode}
        disabled={videos.length <= 1}
        className='mb-4'
      >
        {reorderMode ? 'Finish Reordering' : 'Reorder Videos'}
      </Button>

      <VideoList
        videos={currentVideos}
        reorderMode={reorderMode}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default VideosDraggerContainer;
