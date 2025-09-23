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
import ManageSubcategoryForm from '../forms/manage-subcategory-form';

interface CreateSubcategoryButtonProps {
  playlistId: string;
}

const CreateSubcategoryButton = ({
  playlistId
}: CreateSubcategoryButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer rounded-full' variant='outline'>
          Create Subcategory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='mb-3'>Create a new subcategory</DialogTitle>
          <ManageSubcategoryForm
            onClose={handleClose}
            playlistId={playlistId}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default CreateSubcategoryButton;
