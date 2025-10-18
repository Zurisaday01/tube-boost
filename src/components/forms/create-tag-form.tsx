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

import { createTagSchema } from '@/lib/schemas';
import { useTransition } from 'react';
import { createTag as createTagAction } from '@/lib/actions/tag';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

import { z } from 'zod';
import { handleActionResponse } from '@/lib/utils';

interface CreateTagFormProps {
  onClose: () => void;
  groupId: string;
}

const CreateTagForm = ({ onClose, groupId }: CreateTagFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createTagSchema>>({
    resolver: zodResolver(createTagSchema),
    defaultValues: {
      name: '',
    }
  });

  function onSubmit(values: z.infer<typeof createTagSchema>) {
    startTransition(async () => {
      try {
        const response = await createTagAction(values, groupId);

        handleActionResponse(response, () => {
          form.reset();
          onClose();
        });
      } catch (err) {
        toast.error('Failed to create tag.');
      }
    });
  }

  console.log('Form errors:', form.formState.errors, groupId);

  const onCancel = () => {
    form.reset();
  };

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tag Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter tag name'
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
            ) : (
              'Create'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default CreateTagForm;
