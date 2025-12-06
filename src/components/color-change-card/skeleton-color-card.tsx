'use client';

const SkeletonColorCard = () => {
  return (
    <div className='flex items-center gap-3 rounded-md p-3 bg-gray-100 dark:bg-white/10 animate-pulse'>
      <div className='w-7 h-7 rounded-full bg-gray-200 dark:bg-white/20' />
      <div className='h-4 w-24 rounded bg-gray-200 dark:bg-white/20' />
    </div>
  );
};

export default SkeletonColorCard;
