'use client';
import React from 'react';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import SearchInput from '../search-input';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { Combobox } from '../ui/combobox';
import { ComboboxDataItem } from '@/types';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { ChartColumnStacked } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import CreatePlaylistButton from '../dialog/create-playlist-button';

// Example Tags
const tags: ComboboxDataItem[] = [
  { value: 'react', label: 'React' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'ux', label: 'UX' },
  { value: 'web-inspiration', label: 'Web Inspiration' },
  { value: 'lofi', label: 'Lo-fi' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'project-idea', label: 'Project Idea' },
  { value: 'reference', label: 'Reference' }
];

export default function Header() {
  const { open } = useSidebar();

  const router = useRouter();

  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-13'>
      <div className='flex items-center gap-2 px-4'>
        {open ? (
          <SidebarTrigger className='-ml-1' />
        ) : (
          <span className='font-oswald block p-2 text-2xl font-semibold'>
            TubeBoost
          </span>
        )}

        <Separator orientation='vertical' className='mr-2 h-4' />
      </div>
      <div className='flex items-center gap-3'>
        <div className='hidden md:flex'>
          <SearchInput />
        </div>
        {/* Filter the videos based on the selected tag */}
        <Combobox placeholder='Select a tag' type='tag' dataItems={tags} />
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

      <div className='flex items-center gap-2 px-4'>
        <CreatePlaylistButton />
        <UserNav />
        <ModeToggle />
      </div>
    </header>
  );
}
