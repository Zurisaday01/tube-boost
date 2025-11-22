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
import { deleteSubcategory } from '@/lib/actions/subcategory';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';

interface DeleteSubcategoryButtonProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteSubcategoryAlert = ({
  id,
  open,
  onOpenChange
}: DeleteSubcategoryButtonProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // <- Stop Link navigation
    try {
      const result = await deleteSubcategory(id);
      handleActionResponse(result, () => {
        onOpenChange(false);
      });
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        isPropagationStopped
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this subcategory? This action cannot
            be undone.{' '}
            <span className='text-red-500'>
              This will delete all videos within this subcategory.
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
export default DeleteSubcategoryAlert;
