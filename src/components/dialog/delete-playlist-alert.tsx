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
import { deletePlaylist } from '@/lib/actions/playlist';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';

interface DeletePlaylistAlertProps {
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeletePlaylistAlert = ({
  id,
  title,
  open,
  onOpenChange
}: DeletePlaylistAlertProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // <- Stop Link navigation
    try {
      const result = await deletePlaylist(id, title);
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
          <AlertDialogTitle>
            Delete <span className='text-primary'>{title}</span> Playlist
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this playlist? This action cannot be
            undone.{' '}
            <span className='text-red-500'>
              This will delete all playlist videos within this playlist.
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
export default DeletePlaylistAlert;
