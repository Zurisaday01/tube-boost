import { VideoTagWithTag } from '@/types/actions';
import VideoTagOption from './video-tag-option';

interface VideoTagsListProps {
  videoTags: VideoTagWithTag[];
  selectedTagId: string | null;
  isPending: boolean;
  onTagRemove: (tagId: string) => void;
}

const VideoTagsList = ({
  videoTags,
  isPending,
  selectedTagId,
  onTagRemove
}: VideoTagsListProps) => {
  return (
    <div className='flex items-center gap-2'>
      {videoTags.map((vt: VideoTagWithTag) => (
        <VideoTagOption
          key={vt.tag.id}
          videoTag={vt}
          isPending={isPending}
          selectedTagId={selectedTagId}
          onTagRemove={onTagRemove}
        />
      ))}
    </div>
  );
};
export default VideoTagsList;
