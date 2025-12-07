'use client';

const SkeletonColorChangeTag = ({ isCard = false }: { isCard?: boolean }) => {
  return (
    <div
      className={`w-fit rounded-full border border-gray-300 dark:border-white/20 ${isCard ? 'bg-gray-100 dark:bg-white/10' : 'bg-gray-100 dark:bg-white/10 '} animate-pulse`}
    >
      <span className='flex w-fit items-center gap-1 rounded-full p-2 text-sm font-medium'>
        <div className='w-3 h-3 rounded-full bg-gray-200 dark:bg-white/20' />
        <div className='h-3 w-10 rounded bg-gray-200 dark:bg-white/20' />
      </span>
    </div>
  );
};

export default SkeletonColorChangeTag;
