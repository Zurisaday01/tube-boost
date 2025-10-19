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
import { deletePlaylistVideo } from '@/lib/actions/video';
import { handleActionResponse } from '@/lib/utils';
import { toast } from 'sonner';

interface DeletePlaylistVideoAlertProps {
  id: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeletePlaylistVideoAlert = ({
  id,
  title,
  open,
  onOpenChange
}: DeletePlaylistVideoAlertProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // <- Stop Link navigation
    try {
      const result = await deletePlaylistVideo(id, title);
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
          <AlertDialogTitle>
            Delete <span className='text-primary'>{title}</span> Playlist Video
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this playlist video?{' '}
            <span className='text-red-500'>This action cannot be undone. </span>
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
export default DeletePlaylistVideoAlert;
