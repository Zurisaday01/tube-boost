import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface AddTimestampNoteActionProps {
  isNoteTakingReady: boolean;
  addNote: () => void;
}

const AddTimestampNoteAction = ({
  isNoteTakingReady,
  addNote
}: AddTimestampNoteActionProps) => {
  return (
    <div className='flex items-center gap-1'>
      <Button
        onClick={addNote}
        variant='secondary'
        className='w-fit cursor-pointer'
        disabled={!isNoteTakingReady}
      >
        Add Note at Current Time
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            className='rounded-full size-5 cursor-pointer'
          >
            <Info className='size-4 text-muted-foreground hover:text-primary' />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          arrowCustomBg='bg-neutral-200 fill-neutral-200'
          className='bg-neutral-200'
        >
          <p className='text-muted-foreground text-sm max-w-[150px]'>
            Click &quot;Add Note at Current Time&quot; to start referencing to
            specific timestamps in the video.
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
export default AddTimestampNoteAction;
