import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function PageContainer({
  children,
  fullHeight = false,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  fullHeight?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea
          className={cn('h-[calc(100dvh-52px)]', fullHeight && 'h-screen')}
        >
          <div className='flex flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='flex flex-1 p-4 md:px-6'>{children}</div>
      )}
    </>
  );
}
