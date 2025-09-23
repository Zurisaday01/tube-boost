import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import CreatePlaylistForm from '../forms/create-playlist-form';
import { useState } from 'react';

const CreatePlaylistButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='flex cursor-pointer gap-1 rounded-full'>
          <Plus />
          <span>Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new playlist</DialogTitle>
          <CreatePlaylistForm onClose={handleClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePlaylistButton;
