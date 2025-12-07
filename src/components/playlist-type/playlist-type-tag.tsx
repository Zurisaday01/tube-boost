'use client';
import { useTagColors } from '@/hooks/use-tag-colors';
import { cn } from '@/lib/utils';
import { PlaylistType } from '@prisma/client';
import { CircleSmall } from 'lucide-react';

interface PlaylistTypeTagProps {
  playlistType: null | PlaylistType;
  isCard?: boolean;
}

const PlaylistTypeTag = ({
  playlistType,
  isCard = true
}: PlaylistTypeTagProps) => {
  if (!playlistType) return null;

  const { bgColor, displayColor } = useTagColors(playlistType.color);

  return (
    <div
      className={cn(
        'w-fit rounded-full',
        isCard ? 'bg-white dark:bg-transparent' : ''
      )}
    >
      <span
        className='flex w-fit items-center gap-1 rounded-full py-1 pr-3 pl-2 text-sm font-medium transition-colors'
        style={{
          border: `1px solid ${displayColor}`,
          backgroundColor: bgColor,
          color: displayColor
        }}
      >
        <CircleSmall className='size-4' />
        {playlistType.name}
      </span>
    </div>
  );
};

export default PlaylistTypeTag;
