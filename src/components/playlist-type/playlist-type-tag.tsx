'use client';
import { cn, getLuminance, hexToRgb, lighten, rgba } from '@/lib/utils';
import { PlaylistType } from '@prisma/client';
import { CircleSmall } from 'lucide-react';
import { useTheme } from 'next-themes';

interface PlaylistTypeTagProps {
  playlistType: null | PlaylistType;
  isCard?: boolean;
}

const PlaylistTypeTag = ({
  playlistType,
  isCard = true
}: PlaylistTypeTagProps) => {
  const { theme, resolvedTheme } = useTheme();

  if (!playlistType) return null;

  const activeTheme = theme === 'system' ? resolvedTheme : theme;

  const rawColor = playlistType.color ?? '#888888';
  const color = /^#([0-9a-fA-F]{6})$/.test(rawColor) ? rawColor : '#888888';
  const rgb = hexToRgb(color);

  // Background stays the same
  const luminance = getLuminance(rgb);
  const isDarkColor = luminance < 128;

  // 0–255 → normalize luminance
  const lumNorm = luminance / 255;

  // Dynamic brightening factor:
  // dark colors: ~0.35
  // mid colors: ~0.15
  // bright colors: ~0.05
  const dynamicBright = 0.05 + (1 - lumNorm) * 0.3;

  const lightThemeBrightFactor = 0.82 + lumNorm * 0.12;

  // Background
  const bgColor =
    activeTheme === 'dark'
      ? rgba(rgb, isDarkColor ? 0.35 : 0.25)
      : isDarkColor
        ? lighten(rgb, lightThemeBrightFactor) // darker colors brighten more
        : rgba(rgb, 0.2);

  // Border/text
  const displayColor =
    activeTheme === 'dark' ? lighten(rgb, dynamicBright) : color;

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
