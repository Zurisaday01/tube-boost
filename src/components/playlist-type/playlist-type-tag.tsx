import { getLuminance, hexToRgb, lighten, rgba } from '@/lib/utils';
import { PlaylistType } from '@prisma/client';
import { CircleSmall } from 'lucide-react';

interface PlaylistTypeTagProps {
  playlistType: null | PlaylistType;
}

const PlaylistTypeTag = ({ playlistType }: PlaylistTypeTagProps) => {
  const rawColor = playlistType?.color ?? '#888888';
  const color = /^#([0-9a-fA-F]{6})$/.test(rawColor) ? rawColor : '#888888';
  const rgb = hexToRgb(color);
  const luminance = getLuminance(rgb);
  const bgColor = luminance < 128 ? lighten(rgb, 0.95) : rgba(rgb, 0.2);

  if (!playlistType) return null;

  return (
    <div className='rounded-full bg-white'>
      <span
        className='flex w-fit items-center gap-1 rounded-full py-1 pr-3 pl-2 text-sm font-medium transition-colors'
        style={{
          border: `1px solid ${color}`,
          backgroundColor: bgColor,
          color // or set text color same as the group
        }}
      >
        <CircleSmall className='size-4' />
        {playlistType.name}
      </span>
    </div>
  );
};
export default PlaylistTypeTag;
