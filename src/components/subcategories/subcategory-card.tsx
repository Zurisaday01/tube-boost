'use client';
import { Folder } from 'lucide-react';
import SubcategoryOptionsMenu from './subcategory-options-menu';

import { useState } from 'react';
import { handleActionResponse } from '@/lib/utils';
import { updateColor } from '@/lib/actions/subcategory';
import { toast } from 'sonner';
import { InformationSheetDetails } from '@/types';
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

interface SubcategoryCardProps {
  id: string; // needed for color update
  name: string;
  details: InformationSheetDetails;
  color: string;
  playlistId: string; // needed for rename subcategory
}

const SubcategoryCard = ({
  id,
  name,
  details,
  color: subcategoryColor,
  playlistId
}: SubcategoryCardProps) => {
  const [color, setColor] = useState<string>(subcategoryColor);

  const handleColorChange = async (newColor: string) => {
    try {
      const response = await updateColor(id, newColor, name);
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
      href={`/dashboard/playlists/${playlistId}/subcategory/${id}`}
      Icon={Folder}
      OptionsMenu={
        <SubcategoryOptionsMenu
          id={id}
          name={name}
          playlistId={playlistId}
          details={details}
          onColorChange={handleColorChange}
          currentColor={color}
        />
      }
    />
  );
};
export default SubcategoryCard;
