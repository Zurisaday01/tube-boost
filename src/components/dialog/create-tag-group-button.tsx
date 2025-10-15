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
import ManageTagGroupForm from '../forms/manage-tag-group-form';

const CreateTagGroupButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer rounded-full'>
          Create Tag Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new tag group</DialogTitle>
          <ManageTagGroupForm onClose={handleClose} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTagGroupButton;
