'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useSession, signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import { useRouter } from 'next/navigation';

interface UserNavProps {
  isSidebar?: boolean;
}

export function UserNav({ isSidebar = false }: UserNavProps) {
  // Get the user session
  const { data: session, isPending } = useSession();

  const router = useRouter();

  // Show an skeleton loader while the session is being fetched
  if (isPending) {
    return (
      <div className='relative rounded-full bg-gray-100 dark:bg-white/10 animate-pulse w-8 h-8 flex items-center justify-center'>
        <span className='text-xs rounded-sm font-medium bg-gray-300 dark:bg-white/30 select-none h-3 w-4' />
      </div>
    );
  }

  // Check if session and user exist before rendering
  if (session && session.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className={cn('relative rounded-full', isSidebar ? '' : 'h-8 w-8')}
          >
            <UserAvatarProfile
              firstName={session.user.firstName}
              lastName={session.user.lastName}
              email={session.user.email}
              image={session.user.image}
              showInfo={isSidebar}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {session.user.name}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button
              variant='ghost'
              className='w-full'
              onClick={async () => {
                await signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push('/auth/sign-in');
                    }
                  }
                });
              }}
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
