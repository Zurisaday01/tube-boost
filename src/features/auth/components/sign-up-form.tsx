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

const SignUpForm = () => {
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
    const res = await signUp.email({
      name: `${values.firstName} ${values.lastName}`,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password
    });

    if (res.data && res.data.token) {
      toast.success(`Welcome ${values.firstName}!`);
      window.location.href = '/dashboard/playlists'; // Redirect to dashboard on success
    }

    if (res.error) {
      toast.error(res.error.statusText || 'Something went wrong.');
    }
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
