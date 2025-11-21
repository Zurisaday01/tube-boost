'use client';
import { useKBar, useRegisterActions } from 'kbar';
import { IconSearch } from '@tabler/icons-react';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

export default function SearchInput() {
  const [results, setResults] = useState<{
    playlistVideos: any[];
    playlists: any[];
  }>({ playlistVideos: [], playlists: [] });
  const { searchQuery, query } = useKBar((state) => ({
    searchQuery: state.searchQuery
  }));

  // Register dynamic KBar actions
  useRegisterActions(
    [
      // Playlist videos
      ...results.playlistVideos.map((item) => {
        const noteText = item.note?.searchableText ?? '';
        const queryLower = searchQuery.toLowerCase();
        const noteLower = noteText.toLowerCase();
        let subtitle = `Video from ${item.playlist.title} playlist`;

        // Check if the note contains the query
        const matchIndex = noteLower.indexOf(queryLower);
        if (matchIndex >= 0) {
          // Extract a snippet around the match (50 chars before and after)
          const start = Math.max(0, matchIndex - 50);
          const end = Math.min(
            noteText.length,
            matchIndex + queryLower.length + 50
          );
          const snippet = noteText.slice(start, end).replace(/\n/g, ' ');
          subtitle = `Note from ${item.playlist.title} playlist: …${snippet}…`;
        }

        return {
          id: `video-${item.id}`,
          name: item.video.title,
          section: 'Search Results',
          subtitle,
          perform: () => (window.location.href = `/dashboard/videos/${item.id}`)
        };
      }),

      // Standalone playlists
      ...results.playlists.map((playlist) => ({
        id: `playlist-${playlist.id}`,
        name: playlist.title,
        section: 'Search Results',
        subtitle: 'Playlist',
        perform: () =>
          (window.location.href = `/dashboard/playlists/${playlist.id}`)
      }))
    ],
    [results, searchQuery]
  );

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setResults({ playlistVideos: [], playlists: [] });
      return;
    }

    let active = true; // token to check stale requests

    // Debounce search requests
    const timeoutId = setTimeout(() => {
      const fetchResults = async () => {
        try {
          const res = await fetch(
            `/api/search?q=${encodeURIComponent(trimmedQuery)}`
          );
          const data = await res.json();
          if (active) setResults(data); // only set if this request is still current
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      };

      fetchResults();
    }, 300); // 300ms debounce delay

    return () => {
      active = false; // invalidate if query changes or component unmounts
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  return (
    <div className='w-full space-y-2'>
      <Button
        variant='outline'
        className='bg-background text-muted-foreground relative h-9 w-full justify-start rounded-full text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64'
        onClick={query.toggle}
      >
        <IconSearch className='mr-2 h-4 w-4' />
        Search playlists or videos
        <kbd className='bg-muted pointer-events-none absolute top-[0.3rem] right-[0.3rem] hidden h-6 items-center gap-1 rounded-full border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex'>
          <span className='text-xs'>⌘</span>K
        </kbd>
      </Button>
    </div>
  );
}
