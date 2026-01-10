'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { useBreadcrumbs } from '@/hooks/use-breadcrumbs';
import { IconSlash } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

export function Breadcrumbs() {
  const items = useBreadcrumbs();
  const pathname = usePathname();
  if (items.length === 0) return null;

  // Don't show breadcrumbs on root dashboard
  // dashboard/playlists or dashboard/tag-groups
  const segments = pathname.split('/').filter(Boolean);

  // Hide on /dashboard
  if (segments.length === 1 && segments[0] === 'dashboard') return null;

  // Hide on /dashboard/*
  if (segments.length === 2 && segments[0] === 'dashboard') return null;

  return (
    <Breadcrumb className='px-4 py-3 md:px-6'>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={item.title}>
            {index !== items.length - 1 && (
              <BreadcrumbItem className='hidden md:block'>
                <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {index < items.length - 1 && (
              <BreadcrumbSeparator className='hidden md:block'>
                <IconSlash />
              </BreadcrumbSeparator>
            )}
            {index === items.length - 1 && (
              <BreadcrumbPage>{item.title}</BreadcrumbPage>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
