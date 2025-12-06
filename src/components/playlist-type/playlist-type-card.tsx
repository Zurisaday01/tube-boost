'use client';
import { Tag } from 'lucide-react';
import { InformationSheetDetails } from '@/types';
import { useState } from 'react';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';
import { updatePlaylistTypeColor } from '@/lib/actions/playlist-type';
import PlaylistTypeOptionsMenu from './playlist-type-menu';
import dynamic from 'next/dynamic';
import SkeletonColorCard from '../color-change-card/skeleton-color-card';

// Dynamically import ColorCardBase to avoid SSR issues (hydration mismatch)
const ColorCardBase = dynamic(
  () => import('../color-change-card/color-card-base'),
  {
    ssr: false,
    loading: () => <SkeletonColorCard />
  }
);

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

  return (
    <ColorCardBase
      id={id}
      name={name}
      initialColor={color}
      href={`/dashboard/playlist-types/${id}`}
      Icon={Tag}
      OptionsMenu={
        <PlaylistTypeOptionsMenu
          id={id}
          name={name}
          description={description}
          details={details}
          onColorChange={handleColorChange}
          currentColor={color}
        />
      }
    />
  );
};
export default PlaylistTypeCard;
