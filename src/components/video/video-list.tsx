import VideoCard from './video-card';
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext
} from '@dnd-kit/sortable';
import SortableVideoCard from './sortable-video-card';
import { PlaylistVideoIncludeVideo } from '@/types/actions';
import { VideoThumbnails } from '@/types';

interface VideoListProps {
  videos: PlaylistVideoIncludeVideo[];
  reorderMode: boolean;
  onReorder: (newOrder: PlaylistVideoIncludeVideo[]) => void;
}

const VideoList = ({ videos, reorderMode, onReorder }: VideoListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor) // move using pointer (mouse, touch, pen)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = videos.findIndex((v) => v.id === active.id);
      const newIndex = videos.findIndex((v) => v.id === over?.id);
      const newVideos = arrayMove(videos, oldIndex, newIndex);
      onReorder(newVideos);
    }
  };

  // Responsive grid: 1 col (mobile), 2 (sm), 3 (lg), 4 (xl)
  const gridClass =
    'mt-8 grid w-full gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  if (!reorderMode) {
    return (
      <div className={gridClass}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            id={video.id}
            title={video.video.title}
            channelTitle={video.video.channelTitle}
            youtubeVideoId={video.video.youtubeVideoId}
            duration={Number(video.video.duration)}
            thumbnails={video.video.thumbnails}
            addedAt={video.addedAt as Date}
            reorderMode={reorderMode}
          />
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={videos.map((v) => v.id)}
        strategy={rectSortingStrategy}
      >
        <div className={gridClass}>
          {videos.map((video) => (
            <div key={video.id} className='h-[320px] w-[350px]'>
              <SortableVideoCard
                key={video.id}
                id={video.id}
                title={video.video.title}
                channelTitle={video.video.channelTitle}
                youtubeVideoId={video.video.youtubeVideoId}
                duration={Number(video.video.duration)}
                thumbnails={
                  video.video.thumbnails as unknown as VideoThumbnails
                }
                addedAt={video.addedAt as Date}
                reorderMode={reorderMode}
              />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
export default VideoList;
