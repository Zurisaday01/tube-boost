'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ManageSubcategoryForm from '../forms/manage-subcategory-form';

interface CreateSubcategoryButtonProps {
  id: string;
  name: string;
  playlistId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RenameSubcategory = ({
  id,
  name,
  playlistId,
  open,
  onOpenChange
}: CreateSubcategoryButtonProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()} // stop Radix dropdown from interfering
      >
        <DialogHeader>
          <DialogTitle className='mb-3'>Rename subcategory</DialogTitle>
          <ManageSubcategoryForm
            onClose={() => onOpenChange(false)}
            playlistId={playlistId}
            subcategory={{ id, name }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default RenameSubcategory;
