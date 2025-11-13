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
import { signUpSchema } from '@/lib/schemas';
import { toast } from 'sonner';
import { PasswordField } from './password-field';
import { Loader2 } from 'lucide-react';
import { signUp } from '@/lib/auth-client';
import { ErrorContext } from 'better-auth/react';

interface SignUpFormProps {
  onStoreEmail: (email: string) => void;
}

const SignUpForm = ({ onStoreEmail }: SignUpFormProps) => {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    await signUp.email(
      {
        name: `${values.firstName} ${values.lastName}`,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email.toLowerCase(), // normalize email to lowercase
        password: values.password,
        callbackURL: '/'
      },
      {
        onError: (error: ErrorContext) => {
          toast.error(error.error.message || 'Something went wrong.');
        },
        onSuccess: () => {
          toast.success(
            'Account created! We have sent you a verification email, please check your inbox.'
          );

          // Store the email to show in the verify email section (after a couple of seconds)
          setTimeout(() => {
            // for now since we don't have a dns setup, we will just use a fixed email
            // later we will change this to values.email
            onStoreEmail('zurisaday_01@hotmail.com');
          }, 2000);
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  placeholder='Enter your first name'
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
                  placeholder='Enter your last name'
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

        <PasswordField disabled={form.formState.isSubmitting} />

        <PasswordField
          name='confirmPassword'
          placeholder='Confirm your password'
          label='Confirm Password'
          disabled={form.formState.isSubmitting}
        />

        <Button
          disabled={form.formState.isSubmitting}
          type='submit'
          className='w-full'
        >
          {form.formState.isSubmitting ? (
            <Loader2 className='size-5 animate-spin' />
          ) : (
            'Sign Up'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
