'use client';
import { Tag } from 'lucide-react';
import { InformationSheetDetails } from '@/types';
import { useMemo, useState } from 'react';
import {
  getLuminance,
  handleActionResponse,
  hexToRgb,
  lighten,
  rgba
} from '@/lib/utils';
import { toast } from 'sonner';
import { updatePlaylistTypeColor } from '@/lib/actions/playlist-type';
import PlaylistTypeOptionsMenu from './playlist-type-menu';

interface PlaylistTypeCardProps {
  id: string; // needed for color update
  name: string;
  details: InformationSheetDetails;
  color: string;
  description: string;
}

const PlaylistTypeCard = ({
  id,
  name,
  description,
  details,
  color: playlistTypeColor
}: PlaylistTypeCardProps) => {
  const [color, setColor] = useState<string>(playlistTypeColor);

  const handleColorChange = async (newColor: string) => {
    try {
      const response = await updatePlaylistTypeColor(id, newColor, name);
      handleActionResponse(response, () => setColor(newColor));
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Something went wrong while updating the color.');
    }
  };

  // lighter/opaque version (e.g. 20% opacity background)
  const bgColor = useMemo(() => {
    const rgb = hexToRgb(color);
    const luminance = getLuminance(rgb);

    // threshold ~128 → dark color
    if (luminance < 128) {
      return lighten(rgb, 0.95); // almost white pastel for dark colors
    }
    return rgba(rgb, 0.2);
  }, [color]);

  return (
    <div
      className='flex items-center gap-3 rounded-md p-3'
      style={{ backgroundColor: bgColor }}
    >
      <Tag className='size-7' style={{ color }} />
      <p>{name}</p>
      <PlaylistTypeOptionsMenu
        id={id}
        name={name}
        description={description}
        details={details}
        onColorChange={handleColorChange}
        currentColor={color}
      />
    </div>
  );
};
export default PlaylistTypeCard;
