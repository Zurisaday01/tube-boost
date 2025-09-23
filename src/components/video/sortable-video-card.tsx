import { VideoThumbnails } from '@/types';
import VideoCard from './video-card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface VideoCardProps {
  id: string;
  title: string;
  youtubeVideoId: string;
  channelTitle: string;
  duration: number; // in seconds
  thumbnails: VideoThumbnails;
  addedAt: Date;
  reorderMode: boolean; // to indicate if in reorder mode
}

const SortableVideoCard = ({
  id,
  title,
  channelTitle,
  duration,
  thumbnails,
  addedAt,
  reorderMode,
  youtubeVideoId // this is used to redirect to the original youtube video
}: VideoCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    cursor: reorderMode ? 'grab' : undefined
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <VideoCard
        key={id}
        id={id}
        title={title}
        channelTitle={channelTitle}
        youtubeVideoId={youtubeVideoId}
        duration={duration}
        thumbnails={thumbnails}
        addedAt={addedAt}
        reorderMode={reorderMode}
      />
    </div>
  );
};
export default SortableVideoCard;
