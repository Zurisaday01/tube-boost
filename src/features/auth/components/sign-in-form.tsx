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
import { SignInSchema, signInSchema } from '@/lib/schemas';
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { PasswordField } from './password-field';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import type { ErrorContext } from 'better-auth/react';

interface SignInFormProps {
  onStoreEmail: (email: string) => void;
}

const SignInForm = ({ onStoreEmail }: SignInFormProps) => {
  // 1. Define your form.
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: SignInSchema) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard/playlists'
      },
      {
        onError: (error: ErrorContext) => {
          // Specific handling for unverified email
          if (error.error.message === 'Email not verified') {
            toast.error('Email not verified', {
              action: (
                <Button
                  className='ml-auto'
                  onClick={() => onStoreEmail('zurisaday_01@hotmail.com')} // use values.email in production
                  size='sm'
                >
                  Verify
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
          description={
            <Link href='forgot-password'>Forgot your password?</Link>
          }
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
