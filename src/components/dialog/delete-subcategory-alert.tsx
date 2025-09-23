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
  const handleDelete = async () => {
    const result = await deleteSubcategory(id);
    if (result.success) {
      toast.success('Subcategory deleted successfully');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
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
