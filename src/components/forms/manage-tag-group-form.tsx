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

import { z } from 'zod';
import {
  createTagGroup as createTagGroupAction,
  updateTagGroup as updateTagGroupAction
} from '@/lib/actions/tag-group';
import { devLog, handleActionResponse } from '@/lib/utils';
import { createTagGroupSchema } from '@/lib/schemas';
import { Textarea } from '@/components/ui/textarea';

interface TagGroupFormProps {
  onClose: () => void;
  tagGroup?: {
    id: string;
    name: string;
    description: string;
  };
}

// Form component for creating or updating a tag group
const ManageTagGroupForm = ({ onClose, tagGroup }: TagGroupFormProps) => {
  const [isPending, startTransition] = useTransition();

  // Decide whether we're in "create" or "update" mode
  const isEditMode = !!tagGroup;

  const form = useForm<z.infer<typeof createTagGroupSchema>>({
    resolver: zodResolver(createTagGroupSchema),
    defaultValues: {
      name: tagGroup?.name || '',
      description: tagGroup?.description || ''
    }
  });

  const onSubmit = (values: z.infer<typeof createTagGroupSchema>) => {
    startTransition(async () => {
      try {
        // Unify await call
        const response = await (tagGroup
          ? updateTagGroupAction(tagGroup!.id, values)
          : createTagGroupAction(values));

        handleActionResponse(response, () => {
          form.reset();
          onClose();
        });
      } catch (err) {
        devLog.error('Unexpected error handling tag group:', err);
        toast.error('Something went wrong.');
      }
    });
  };

  const onCancel = () => {
    form.reset();
    onClose();
  }

  const isLoading = isPending || form.formState.isSubmitting;

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
                  placeholder='Enter tag group name'
                  autoComplete='off'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Enter description (optional)'
                  autoComplete='off'
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end gap-2'>
          <Button
            type='button'
            variant='secondary'
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type='submit'>
            {isLoading ? (
              <LoaderCircle className='h-4 w-4 animate-spin' />
            ) : isEditMode ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ManageTagGroupForm;
