import Link from 'next/link';
import Image from 'next/image';
import ResetPasswordForm from './reset-password-form';

export default function ResetPasswordViewPage() {
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
            <h1 className='text-4xl font-bold'>Reset Your Password</h1>
            <p>Enter your new password below to reset your account password.</p>
          </div>

          <div className='w-full max-w-[500px]'>
            <ResetPasswordForm />
          </div>
        </div>

        {/* Bottom link */}
        <p className='text-center text-sm'>
          Don’t need to reset it?{' '}
          <Link
            href='/auth/sign-in'
            className='hover:text-primary font-medium transition-all duration-100'
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
