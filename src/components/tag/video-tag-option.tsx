import { VideoTagWithTags } from '@/types/actions';
import { CircleX, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import SkeletonColorChangeTag from '../color-change-tag/skeleton-change-tag';

const PlaylistVideoTag = dynamic(() => import('./playlist-video-tag'), {
  ssr: false,
  loading: () => <SkeletonColorChangeTag />
});

interface VideoTagOptionProps {
  videoTag: VideoTagWithTags;
  isPending: boolean;
  selectedTagId: string | null;
  onTagRemove: (tagId: string) => void;
}

const VideoTagOption = ({
  videoTag,
  isPending,
  selectedTagId,
  onTagRemove
}: VideoTagOptionProps) => {
  return (
    <div
      key={videoTag.tag.id}
      className='flex rounded-full bg-neutral-100 dark:bg-white/10 p-1'
    >
      <PlaylistVideoTag videoTag={videoTag} />

      <button
        disabled={isPending}
        className='cursor-pointer rounded-full px-1 hover:bg-transparent'
        onClick={() => onTagRemove(videoTag.tag.id)}
      >
        {isPending && videoTag.tag.id === selectedTagId ? (
          <Loader2 className='size-4 animate-spin text-neutral-500' />
        ) : (
          <CircleX className='size-4 text-neutral-500 transition-all duration-100 hover:text-red-500' />
        )}
      </button>
    </div>
  );
};
export default VideoTagOption;
