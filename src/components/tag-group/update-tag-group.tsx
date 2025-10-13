'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ManageTagGroupForm from '../forms/manage-tag-group-form';

interface RenameTagGroupProps {
  id: string;
  name: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpdateTagGroup = ({
  id,
  name,
  description,
  open,
  onOpenChange
}: RenameTagGroupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onClick={(e) => e.stopPropagation()} // stop Radix dropdown from interfering
      >
        <DialogHeader>
          <DialogTitle className='mb-3'>Update tag group</DialogTitle>
          <ManageTagGroupForm
            onClose={() => onOpenChange(false)}
            tagGroup={{ id, name, description }}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateTagGroup;
