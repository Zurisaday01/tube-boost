'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateProfileSchema, UpdateProfileSchema } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';

interface UpdateProfileFormProps {
  firstName: string;
  lastName: string;
  email: string;
}

const UpdateProfileForm = ({ firstName, lastName, email }: UpdateProfileFormProps) => {
  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: firstName,
      lastName: lastName,
      email: email
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdateProfileSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full flex flex-col gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder='First Name'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder='Last Name'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder='you@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          className='self-auto sm:self-end'
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='size-5 animate-spin' />
          ) : (
            'Save Changes'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
