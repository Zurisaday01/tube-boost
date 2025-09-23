'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useTransition } from 'react';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import z from 'zod';
import {
  createSubcategory as createSubcategoryAction,
  updateSubcategory as updateSubcategoryAction
} from '@/lib/actions/subcategory';
import { devLog } from '@/lib/utils';
import { createSubcategorySchema } from '@/lib/schemas';

interface SubcategoryFormProps {
  onClose: () => void;
  playlistId: string;
  subcategory?: {
    id: string;
    name: string;
  };
}

// Form component for creating or updating a subcategory
const ManageSubcategoryForm = ({
  onClose,
  playlistId,
  subcategory
}: SubcategoryFormProps) => {
  const [isPending, startTransition] = useTransition();

  // Decide whether we're in "create" or "update" mode
  const isEditMode = !!subcategory;

  const form = useForm<z.infer<typeof createSubcategorySchema>>({
    resolver: zodResolver(createSubcategorySchema),
    defaultValues: {
      name: subcategory?.name || '',
      playlistId
    }
  });

  const onSubmit = (values: z.infer<typeof createSubcategorySchema>) => {
    startTransition(async () => {
      try {
        if (isEditMode && subcategory?.id) {
          await updateSubcategoryAction(subcategory.id, values);
          toast.success(`'${values.name}' updated successfully!`);
        } else {
          const { subcategory: created } =
            await createSubcategoryAction(values);
          toast.success(`'${created?.name}' created successfully!`);
        }
        form.reset();
        onClose();
      } catch (err) {
        devLog.error('Error handling subcategory:', err);
        toast.error('Failed to save subcategory.');
      }
    });
  };

  const onCancel = () => form.reset();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter subcategory name'
                  autoComplete='off'
                  disabled={isPending || form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button type='button' variant='secondary' onClick={onCancel}>
            {isPending || form.formState.isSubmitting ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : (
              'Cancel'
            )}
          </Button>
          <Button type='submit'>
            {isPending || form.formState.isSubmitting ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : isEditMode ? (
              'Rename'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageSubcategoryForm;
