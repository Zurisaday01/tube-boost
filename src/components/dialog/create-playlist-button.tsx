import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import ManagePlaylistForm from '../forms/manage-playlist-form';
import { useState } from 'react';

const CreatePlaylistButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='flex cursor-pointer gap-1 rounded-md !px-2 sm:!px-4 h-8 sm:rounded-full'>
          <Plus />
          <span className='hidden sm:block'>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new playlist</DialogTitle>
          <ManagePlaylistForm onClose={handleClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePlaylistButton;
