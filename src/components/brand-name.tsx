'use client';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface BrandNameProps {
  location?: 'dashboard' | 'auth';
}

const BrandName = ({ location = 'auth' }: BrandNameProps) => {
  const { resolvedTheme } = useTheme();

  return (
    <p
      className={cn(
        'font-oswald flex items-center p-2 text-2xl font-semibold',
        location === 'dashboard'
          ? 'transition-colors duration-150 hover:opacity-80'
          : ''
      )}
    >
      <Image
        src={
          resolvedTheme === 'dark'
            ? '/images/tube-boost-dark.png'
            : '/images/tube-boost-light.png'
        }
        alt='TubeBoost Logo'
        width={50}
        height={50}
        className='inline-block mr-2 w-8 h-7'
      />
      Tube<span className='text-primary'>Boost</span>
    </p>
  );
};
export default BrandName;
