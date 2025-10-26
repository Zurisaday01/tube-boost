'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ManagePlaylistTypeForm from '../forms/manage-playlist-type-form';

interface UpdatePlaylistTypeProps {
  id: string;
  name: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdatePlaylistType = ({
  id,
  name,
  description,
  open,
  onOpenChange
}: UpdatePlaylistTypeProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        isPropagationStopped
        onClick={(e) => e.stopPropagation()} // stop Radix dropdown from interfering
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle className='mb-3'>Update playlist type</DialogTitle>
          <ManagePlaylistTypeForm
            onClose={() => onOpenChange(false)}
            playlistType={{ id, name, description }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default UpdatePlaylistType;
