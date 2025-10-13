'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { VideoData } from '@/types';
import { createVideoAndAttach } from '@/lib/actions/video';
import { toast } from 'sonner';

interface Options {
  label: string;
  value: string;
}

interface AddVideoProps {
  subcategoryOptions: Options[];
  searchedVideo: VideoData;
  playlistId: string;
  onClear: () => void;
}

const AddVideo = ({
  subcategoryOptions,
  searchedVideo,
  playlistId,
  onClear
}: AddVideoProps) => {
  // this state will hold the selected option from the dropdown
  // - if: uncategorized option = playlistId
  // - else: subcategories = subcategoryOptions.value (the value is the id of the subcategory)

  // isDefault indicates if the selected option is the default "Uncategorized" option, in case isDefault is false we are selecting a subcategory
  // id holds the actual id of the playlist or subcategory

  const handleOptionSelect = async (isDefault: boolean, id: string) => {
    const { status, message } = await createVideoAndAttach(
      searchedVideo,
      playlistId,
      isDefault ? undefined : id
    );

    if (status === 'success') {
      // Send feedback to user
      toast.success(
        `${searchedVideo.title} added successfully to '${isDefault ? 'Uncategorized' : subcategoryOptions.find((option) => option.value === id)?.label!}'!`
      );
      // clear the selected video
      onClear();
    } else {
      toast.error(message);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='rounded-full' variant='outline'>
          Add
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleOptionSelect(true, playlistId)}>
          Uncategorized
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {subcategoryOptions.length > 0 ? (
          subcategoryOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleOptionSelect(false, option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            No subcategories available
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default AddVideo;
