'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import AssignUpdatePlaylistTypeForm from '../forms/assign-update-playlist-type-form';

interface CreatePlaylistButtonProps {
  id: string;
  open: boolean;
  actionType?: 'Assign' | 'Update';
  onOpenChange: (open: boolean) => void;
}

const AssignUpdatePlaylistType = ({
  id, // We are passing the playlist id here
  open,
  actionType = 'Assign',
  onOpenChange
}: CreatePlaylistButtonProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isPropagationStopped
        onClick={(e) => e.stopPropagation()} // stop Radix dropdown from interfering
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className='mb-3'>{actionType} playlist type</DialogTitle>
          <AssignUpdatePlaylistTypeForm
            actionType={actionType}
            onClose={() => onOpenChange(false)}
            playlistId={id}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default AssignUpdatePlaylistType;
