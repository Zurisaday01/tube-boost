import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { deleteTagGroup } from '@/lib/actions/tag-group';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';

interface DeleteTagGroupAlertProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteTagGroupAlert = ({
  id,
  open,
  onOpenChange
}: DeleteTagGroupAlertProps) => {
  const handleDelete = async () => {
    try {
      const result = await deleteTagGroup(id);
      handleActionResponse(result, () => {
        onOpenChange(false);
      });
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tag Group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this tag group? This action cannot
            be undone.{' '}
            <span className='text-red-500'>
              This will delete all tags within this tag group.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteTagGroupAlert;
