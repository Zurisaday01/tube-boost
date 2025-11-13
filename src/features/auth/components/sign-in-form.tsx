'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { signInSchema } from '@/lib/schemas';
import { sendVerificationEmail, signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { PasswordField } from './password-field';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { ErrorContext } from 'better-auth/react';
import { useState } from 'react';

const SignInForm = () => {
  const [isResending, setIsResending] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Triggering manually Email Verification
      await sendVerificationEmail(
        {
          email: 'zurisaday_01@hotmail.com', // later we will change this to form.getValues('email')
          callbackURL: '/dashboard' // The redirect URL after verification
        },
        {
          onRequest(context) {
            console.log(
              'Resend verification email request initiated.',
              context
            );
          },
          onSuccess: () => {
            toast.success(
              'Verification email resent! Please check your inbox.'
            );
          },
          onError: (error) => {
            toast.error(
              error.error.message || 'Failed to resend verification email.'
            );
          }
        }
      );
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard/playlists'
      },
      {
        // TODO: dismiss toast after clicking resend
        onError: (error: ErrorContext) => {
          // Specific handling for unverified email
          if (error.error.message === 'Email not verified') {
            toast.error('Email not verified', {
              action: (
                <Button className='ml-auto' onClick={handleResend} disabled={isResending} size='sm'>
                  Resend
                </Button>
              )
            });
            return;
          }

          // Generic error handling
          toast.error(error.error.message || 'Something went wrong.');
        },
        onSuccess: () => {
          toast.success('Signed in successfully!');
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

        <PasswordField
          disabled={form.formState.isSubmitting}
          description={<Link href='reset'>Forgot your password?</Link>}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          className='w-full'
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='size-5 animate-spin' />
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
