'use client';
import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useState } from 'react';

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await signIn.email({
      email: formData.get('email') as string,
      password: formData.get('password') as string
    });

    if (res.error) {
      setError(res.error.message || 'Something went wrong.');
    } else {
      router.push('/dashboard');
    }
  }
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          name='email'
          type='email'
          placeholder='Email'
          required
          className='w-full rounded-md border px-3 py-2'
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          required
          minLength={8}
          className='w-full rounded-md border px-3 py-2'
        />
        <Button type='submit' className='w-full'>
          Sign In
        </Button>

        <Link
          href='/auth/sign-up'
          className='text-sm text-gray-500 hover:underline'
        >
          Don&#39;t have an account? Sign Up
        </Link>
      </form>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};
export default SignInForm;
