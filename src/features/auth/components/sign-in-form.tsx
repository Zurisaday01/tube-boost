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
import { signIn } from '@/lib/auth-client';
import { toast } from 'sonner';
import { PasswordField } from './password-field';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { ErrorContext } from 'better-auth/react';

const SignInForm = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    await signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard/playlists'
      },
      {
        onError: (error: ErrorContext) => {
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
