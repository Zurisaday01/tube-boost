'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ResetPasswordSchema, resetPasswordSchema } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';
import type { ErrorContext } from 'better-auth/react';
import { toast } from 'sonner';
import { resetPassword } from '@/lib/auth-client';
import { PasswordField } from './password-field';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const error = searchParams.get('error');

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: ResetPasswordSchema) {
    // if no token in params, return
    if (token == null) return;

    await resetPassword(
      {
        newPassword: values.password,
        token
      },
      {
        onError: (error: ErrorContext) => {
          toast.error(error.error.message || 'Something went wrong.');
        },
        onSuccess: () => {
          // Send user a success toast
          toast.success('Password reset successful!', {
            description: 'Redirection to login...'
          });
          // Redirect to login after 1 second
          setTimeout(() => {
            router.push('/auth/sign-in');
          }, 1000);
        }
      }
    );
  }

  if (token == null || error != null) {
    return (
      <div className='flex w-full flex-col gap-4'>
        <header>
          <h2 className='text-primary font-semibold'>Invalid Reset Link</h2>
          <p>The password reset link is invalid or has expired.</p>
        </header>
        <div>
          <Button className='w-full' asChild>
            <Link href='/auth/sign-in'>Back to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <PasswordField
          disabled={form.formState.isSubmitting}
          label='New Password'
        />
        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          className='w-full'
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='size-5 animate-spin' />
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
