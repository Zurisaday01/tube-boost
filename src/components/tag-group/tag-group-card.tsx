'use client';
import { Folder } from 'lucide-react';
import SubcategoryOptionsMenu from './tag-group-options-menu';
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
import { updateTagGroupColor } from '@/lib/actions/tag-group';

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
      <Folder className='size-7' style={{ color }} />
      <p>{name}</p>
      <SubcategoryOptionsMenu
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
export default TagGroupCard;
