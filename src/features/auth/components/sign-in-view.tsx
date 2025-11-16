'use client';

import Link from 'next/link';
import SignInForm from './sign-in-form';
import Image from 'next/image';
import VerifyEmailSection from './verify-email-section';
import { useState } from 'react';

export default function SignInViewPage() {
  const [email, setEmail] = useState<string | null>(null);

  const handleStoreEmail = (email: string) => {
    setEmail(email);
  };

  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left image section */}
      <div className='relative hidden h-full flex-col p-2 lg:flex dark:border-r'>
        <div className='relative h-full w-full overflow-hidden rounded-4xl bg-white p-4'>
          <Image
            src='/images/auth.jpg'
            alt='Authentication'
            fill
            sizes='(min-width: 1024px) 50vw, 100vw'
            className='absolute inset-0 z-10 object-cover'
          />
        </div>
      </div>

      {/* Right form section */}
      <div className='relative flex h-full flex-col justify-between p-4 lg:p-8'>
        {/* Top brand */}
        <div className='absolute top-4 left-1/2 -translate-x-1/2'>
          <span className='font-oswald block p-2 text-2xl font-semibold'>
            TubeBoost
          </span>
        </div>

        {/* Center content */}
        <div className='relative flex flex-grow flex-col items-center justify-center space-y-6'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-4xl font-bold'>Welcome Back</h1>
            <p>Enter your email and password to access your account</p>
          </div>

          <div className='w-full max-w-[500px]'>
            <SignInForm onStoreEmail={handleStoreEmail} />
          </div>

          <p className='text-muted-foreground px-8 text-center text-sm'>
            By clicking sign in, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Bottom link */}
        <p className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/sign-up'
            className='hover:text-primary font-medium transition-all duration-100'
          >
            Sign Up
          </Link>
        </p>

        {/* Verify Email Section (position absolute needs to be in the relative container) */}
        {email && (
          <VerifyEmailSection email={email} shouldStartCountdown={false} />
        )}
      </div>
    </div>
  );
}
