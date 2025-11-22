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
import { deletePlaylistType } from '@/lib/actions/playlist-type';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';

interface DeletePlaylistTypeAlertProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeletePlaylistTypeAlert = ({
  id,
  open,
  onOpenChange
}: DeletePlaylistTypeAlertProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // <- Stop Link navigation
    try {
      const result = await deletePlaylistType(id);
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
          <AlertDialogTitle>Delete Playlist Type</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this playlist type? This action
            cannot be undone.{' '}
            <span className='text-red-500'>
              This will remove this playlist type from all associated playlists.
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
export default DeletePlaylistTypeAlert;
