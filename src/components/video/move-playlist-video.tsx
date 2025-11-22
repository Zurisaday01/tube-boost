'use client';
import { FolderOutput } from 'lucide-react';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '../ui/dropdown-menu';
import { useParams } from 'next/navigation';
import { Subcategory } from '@/types';
import { movePlaylistVideoWithinPlaylist } from '@/lib/actions/video';
import { handleActionResponse } from '@/lib/utils';

interface MovePlaylistVideoProps {
  playlistVideoId: string;
  subcategories: Subcategory[];
}

const MovePlaylistVideo = ({
  playlistVideoId,
  subcategories
}: MovePlaylistVideoProps) => {
  // get playlist id from the url params
  const { id: playlistId, subcategoryId } = useParams();

  const handleOptionSelect = async (isDefault: boolean, id: string) => {
    const response = await movePlaylistVideoWithinPlaylist({
      playlistVideoId,
      targetSubcategoryId: isDefault ? null : id,
      currentSubcategoryId: String(subcategoryId) ?? null
    });

    // Handle response
    handleActionResponse(response);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className='flex' isPropagationStopped>
        <FolderOutput className='text-muted-foreground mr-2 size-4' />
        Move Video
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem
          disabled={!subcategoryId} // disable if already in uncategorized (it means there is no subcategoryId)
          onClick={() => handleOptionSelect(true, String(playlistId))}
        >
          Uncategorized
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {subcategories.length > 0 ? (
          subcategories.map((option) => (
            <DropdownMenuItem
              key={option.id}
              disabled={option.id === subcategoryId} // disable if it's the current subcategory
              onClick={() => handleOptionSelect(false, option.id)}
            >
              {option.name}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No subcategories available
          </DropdownMenuItem>
        )}
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
export default MovePlaylistVideo;
