'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';
import ManagePlaylistTypeForm from '../forms/manage-playlist-type-form';

const CreatePlaylistTypeButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer rounded-full'>
          Create Playlist Type
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new playlist type</DialogTitle>
          <ManagePlaylistTypeForm onClose={handleClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreatePlaylistTypeButton;
