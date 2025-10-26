'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { ReactNode } from 'react';
import Link from 'next/link';
import { Icons } from '../icons';
import React from 'react';
import { MenuAction } from '@/types/menu-items';

interface EntityOptionsMenuProps {
  actions: MenuAction[];
  dialogs?: ReactNode;
}

export const EntityOptionsMenu = ({
  actions,
  dialogs
}: EntityOptionsMenuProps) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='ml-auto flex h-6 w-6 items-center justify-center rounded-full p-0 hover:bg-gray-200'
          >
            <EllipsisVertical className='h-2 w-2' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {actions.map((action, i) => {
            const Icon = action.icon ? Icons[action.icon] : Icons.logo;

            // Render link type menu action
            if (action.type === 'link' && action.href) {
              return (
                <DropdownMenuItem asChild key={i}>
                  <Link href={action.href}>
                    {action.icon && <Icon />}
                    {action.label}
                  </Link>
                </DropdownMenuItem>
              );
            }

            // Render button type menu action
            if (action.type === 'button') {
              if (action.render) {
                return (
                  <React.Fragment key={i}>{action.render()}</React.Fragment>
                );
              }
              return (
                <DropdownMenuItem onClick={action.onClick} key={i}>
                  {action.icon && <Icon />}
                  {action.label}
                </DropdownMenuItem>
              );
            }

            // Render special change-color type menu action
            if (action.type === 'change-color' && action.render) {
              return <React.Fragment key={i}>{action.render()}</React.Fragment>;
            }

            if (action.type === 'separator') {
              return <DropdownMenuSeparator key={i} />;
            }

            return null;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogs}
    </>
  );
};
