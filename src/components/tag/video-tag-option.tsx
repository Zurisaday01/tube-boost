import { VideoTagWithTag } from '@/types/actions';
import { hexToRgb, getLuminance, lighten, rgba } from '@/lib/utils';
import { CircleX, Loader2, Tag } from 'lucide-react';

interface VideoTagOptionProps {
  videoTag: VideoTagWithTag;
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
  const rawColor = videoTag?.tag?.group?.color ?? '#888888';
  const color = /^#([0-9a-fA-F]{6})$/.test(rawColor) ? rawColor : '#888888';
  const rgb = hexToRgb(color);
  const luminance = getLuminance(rgb);
  const bgColor = luminance < 128 ? lighten(rgb, 0.95) : rgba(rgb, 0.2);

  return (
    <div key={videoTag.tag.id} className='flex rounded-full bg-neutral-100 p-1'>
      <span
        className='flex w-fit items-center gap-1 rounded-full py-1 pr-3 pl-2 text-sm font-medium transition-colors'
        style={{
          border: `1px solid ${color}`,
          backgroundColor: bgColor,
          color // or set text color same as the group
        }}
      >
        <Tag className='size-4' />
        {videoTag.tag.name}
      </span>

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
