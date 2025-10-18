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
import CreateTagForm from '../forms/create-tag-form';

const CreateTagButton = ({ groupId }: { groupId: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer rounded-full'>Create Tag</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new tag</DialogTitle>
          <CreateTagForm onClose={handleClose} groupId={groupId} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateTagButton;
