import { useTagColors } from '@/hooks/use-tag-colors';
import { VideoTagWithTags } from '@/types/actions';
import { Tag } from 'lucide-react';

interface PlaylistVideoTagProps {
  videoTag: VideoTagWithTags;
}

const PlaylistVideoTag = ({ videoTag }: PlaylistVideoTagProps) => {
  // Get colors based on tag group color
  const { bgColor, displayColor } = useTagColors(videoTag.tag.group?.color);

  if (!videoTag) return null;

  return (
    <span
      className='flex w-fit items-center gap-1 rounded-full py-1 pr-3 pl-2 text-sm font-medium transition-colors'
      style={{
        border: `1px solid ${displayColor}`,
        backgroundColor: bgColor,
        color: displayColor
      }}
    >
      <Tag className='size-4' />
      {videoTag.tag.name}
    </span>
  );
};
export default PlaylistVideoTag;
