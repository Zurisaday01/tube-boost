'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ManagePlaylistForm from '../forms/manage-playlist-form';

interface CreatePlaylistButtonProps {
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RenamePlaylist = ({
  id,
  title,
  open,
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
          <DialogTitle className='mb-3'>Rename playlist</DialogTitle>
          <ManagePlaylistForm
            onClose={() => onOpenChange(false)}
            playlist={{ id, title }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default RenamePlaylist;
