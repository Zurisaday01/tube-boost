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
import { ForgotPasswordSchema, forgotPasswordSchema } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';
import type { ErrorContext } from 'better-auth/react';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/lib/auth-client';

const ForgotPasswordForm = () => {
  // 1. Define your form.
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: ForgotPasswordSchema) {
    await requestPasswordReset(
      {
        email: values.email,
        redirectTo: '/auth/reset-password'
      },
      {
        onError: (error: ErrorContext) => {
          toast.error(error.error.message || 'Something went wrong.');
        },
        onSuccess: () => {
          toast.success('Password reset email sent successfully!');
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
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

export default ForgotPasswordForm;
