'use client';
import { Folder } from 'lucide-react';
import SubcategoryOptionsMenu from './tag-group-options-menu';
import { InformationSheetDetails } from '@/types';
import { useState } from 'react';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';
import { updateTagGroupColor } from '@/lib/actions/tag-group';
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

interface TagGroupCardProps {
  id: string; // needed for color update
  name: string;
  details: InformationSheetDetails;
  color: string;
  description: string;
}

const TagGroupCard = ({
  id,
  name,
  description,
  details,
  color: tagGroupColor
}: TagGroupCardProps) => {
  const [color, setColor] = useState<string>(tagGroupColor);

  const handleColorChange = async (newColor: string) => {
    try {
      const response = await updateTagGroupColor(id, newColor, name);
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
      href={`/dashboard/tag-groups/${id}`}
      Icon={Folder}
      OptionsMenu={
        <SubcategoryOptionsMenu
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
export default TagGroupCard;
