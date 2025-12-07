'use client';
import React, { useEffect } from 'react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ChartColumnStacked } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import CreatePlaylistButton from '../dialog/create-playlist-button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Header() {
  const { open } = useSidebar();
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-13'>
      <div className='flex items-center gap-2 pl-4'>
        {/* Render the SidebarTrigger only if the client is mounted AND its required state is met (mobile OR desktop open) */}
        {isMobile || open ? (
          <SidebarTrigger className='-ml-1' />
        ) : (
          /* Render the Full Link as the safe server default (desktop closed/unmounted) */
          <Link
            href='/dashboard/playlists'
            className='font-oswald block p-2 text-2xl font-semibold transition-colors duration-150 hover:opacity-80'
          >
            TubeBoost
          </Link>
        )}
        <Separator orientation='vertical' className='mr-2 h-4' />
      </div>
      <div className='flex w-full items-center gap-3 sm:w-fit'>
        <div className='w-max-md w-full'>
          <SearchInput />
        </div>
        {/* Filter the videos based on the selected tag */}
        {/* <Combobox placeholder='Select a tag' type='tag' dataItems={tags} /> */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='cursor-pointer rounded-full'
              onClick={() => router.push('/dashboard/analytics')}
            >
              <ChartColumnStacked />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Check your analytics</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className='flex items-center gap-2 pr-4'>
        <CreatePlaylistButton />
        <div className='hidden sm:block'>
          <UserNav />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
