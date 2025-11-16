'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UpdatePasswordSchema, updatePasswordSchema } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';
import { PasswordField } from '@/features/auth/components/password-field';

const UpdatePasswordForm = () => {
  const form = useForm<UpdatePasswordSchema>({
    resolver: zodResolver(updatePasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UpdatePasswordSchema) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full flex-col gap-5'
      >
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <PasswordField
            name='currentPassword'
            label='Current Password'
            placeholder='Enter your current password'
            disabled={form.formState.isSubmitting}
          />

          <PasswordField
            name='newPassword'
            placeholder='Enter your new password'
            label='New Password'
            disabled={form.formState.isSubmitting}
          />

          <PasswordField
            name='confirmNewPassword'
            placeholder='Confirm your new password'
            label='Confirm New Password'
            disabled={form.formState.isSubmitting}
          />

        </div>
        <div>
          <h3 className='text-sm font-semibold'>Password Requirements</h3>
          <ul className='list-disc list-inside text-sm text-muted-foreground'>
            <li>At least 8 characters long</li>
            <li>Contains both uppercase and lowercase letters</li>
            <li>Includes at least one number</li>
            <li>Has at least one special character (e.g., !@#$%^&*)</li>
          </ul>
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

export default UpdatePasswordForm;
