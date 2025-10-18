'use client';
import { ComboboxDataItem } from '@/types';
import { ComboboxSublist } from '../ui/combobox-sublist';
import { Button } from '../ui/button';
import { useState, useTransition } from 'react';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';
import { addTagToVideo } from '@/lib/actions/tag';
import { Loader2 } from 'lucide-react';

interface SelectTagOptionsProps {
  tagOptions: Record<string, ComboboxDataItem[]>;
  playlistVideoId: string;
}

const SelectTagOptions = ({
  tagOptions,
  playlistVideoId
}: SelectTagOptionsProps) => {
  const [isClearing, setIsClearing] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAddTagToVideo = () => {
    if (!selectedTagId) return;
    startTransition(async () => {
      try {
        const response = await addTagToVideo(selectedTagId, playlistVideoId);

        handleActionResponse(response, () => {
          setIsClearing(true);
        });
      } catch (err) {
        toast.error('Failed to create playlist.');
      }
    });
  };

  const handleClearTags = () => {
    setIsClearing(true);
  };

  return (
    <div className='flex'>
      <ComboboxSublist
        placeholder='Select a tag'
        subType='tag'
        type='group tag'
        dataItems={tagOptions}
        onSelect={setSelectedTagId}
        isClearing={isClearing}
        setClearing={setIsClearing}
      />
      <div className='flex items-center gap-2'>
        {' '}
        <Button
          disabled={!selectedTagId || isPending}
          onClick={handleClearTags}
          variant='outline'
          size='sm'
          className='ml-2 flex-shrink-0 cursor-pointer rounded-full'
        >
          Clear
        </Button>
        <Button
          disabled={!selectedTagId || isPending}
          size='sm'
          onClick={handleAddTagToVideo}
          className='rounded-full'
        >
          {isPending ? <Loader2 className='size-4 animate-spin' /> : 'Add'}
        </Button>
      </div>
    </div>
  );
};
export default SelectTagOptions;
