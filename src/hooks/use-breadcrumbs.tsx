'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link?: string;
};

const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard/playlists': [
    { title: 'Playlists', link: '/dashboard/playlists' }
  ],
  '/dashboard/videos': [{ title: 'Videos', link: '/dashboard/videos' }]
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const parentId = searchParams.get('parentId');
  const parentName = searchParams.get('parentName');
  const parentType = searchParams.get('parentType'); // 'playlist' | 'subcategory'
  const additionalId = searchParams.get('additionalId');

  const breadcrumbs = useMemo(() => {
    // Static routes
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // ─────────────────────────────────────
    // Subcategory inside playlist
    // /dashboard/playlists/:playlistId/subcategory/:subcategoryId
    // ─────────────────────────────────────
    if (
      pathname.includes('/dashboard/playlists/') &&
      pathname.includes('/subcategory/')
    ) {
      const parts = pathname.split('/');

      const playlistId = parts[parts.indexOf('playlists') + 1];
      const subcategoryId = parts[parts.indexOf('subcategory') + 1];

      return [
        { title: 'Playlists', link: '/dashboard/playlists' },
        {
          title: playlistId,
          link: `/dashboard/playlists/${playlistId}`
        },
        { title: 'Subcategories' },
        { title: subcategoryId }
      ];
    }

    // ─────────────────────────────────────
    // Playlist detail
    // /dashboard/playlists/:playlistId
    // ─────────────────────────────────────
    if (pathname.startsWith('/dashboard/playlists/')) {
      const id = pathname.split('/').pop();

      return [
        { title: 'Playlists', link: '/dashboard/playlists' },
        { title: id ?? '' }
      ];
    }

    // ─────────────────────────────────────
    // Video detail (using parent context)
    // ─────────────────────────────────────
    if (pathname.startsWith('/dashboard/videos/')) {
      const videoId = pathname.split('/').pop();

      if (parentId) {
        if (parentType === 'playlist') {
          return [
            { title: 'Playlists', link: '/dashboard/playlists' },
            {
              title: parentName ?? parentId,
              link: `/dashboard/playlists/${parentId}`
            },
            { title: 'Videos' },
            { title: videoId ?? '' }
          ];
        } else if (parentType === 'subcategory') {
          return [
            { title: 'Subcategories' },
            {
              title: parentName ?? parentId,
              link: `/dashboard/playlists/${additionalId}/subcategory/${parentId}`
            },
            { title: 'Videos' },
            { title: videoId ?? '' }
          ];
        }

        return [
          { title: 'Videos', link: '/dashboard/videos' },
          { title: videoId ?? '' }
        ];
      }
    }

    // ─────────────────────────────────────
    // Fallback
    // ─────────────────────────────────────
    const segments = pathname
      .split('/')
      .filter(Boolean)
      .filter((segment) => segment !== 'dashboard');

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname, parentId, parentName, parentType]);

  return breadcrumbs;
}
