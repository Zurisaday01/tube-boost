import { render, screen } from '@testing-library/react';
import type { PlaylistType } from '@prisma/client';

import '@testing-library/jest-dom';
import { formatLocalDate } from '@/lib/utils';
import PlaylistCard from '../playlist-card';

// Mock utils
jest.mock('@/lib/utils', () => ({
  formatLocalDate: jest.fn(() => 'Formatted-Date')
}));

// Mock components
jest.mock('../playlist-options-menu', () => () => <div>Options Menu</div>);
jest.mock('../../playlist-type/playlist-type-tag', () => ({
  __esModule: true,
  default: ({ playlistType }: { playlistType: PlaylistType | null }) =>
    playlistType ? <div>{playlistType.name}</div> : null
}));

/*
Component responsibility:
This component displays a single playlist as a clickable card. It shows the playlist’s basic info (title, dates, counts, type) and links the user to the playlist’s detail page.
*/

describe('PlaylistCard', () => {
  // Mock playlist data
  const mockPlaylistType: PlaylistType = {
    id: 'type1',
    name: 'Public',
    description: 'A public playlist',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'user1',
    color: '#ff0000'
  };
  const mockPlaylist = {
    id: '123',
    title: 'My Playlist',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-01'),
    totalVideos: 10,
    totalCategories: 3,
    playlistType: mockPlaylistType
  };

  it('renders the playlist title', () => {
    render(<PlaylistCard {...mockPlaylist} />);
    expect(screen.getByText('My Playlist')).toBeInTheDocument();
  });

  it('renders formatted creation and update dates', () => {
    render(<PlaylistCard {...mockPlaylist} />);

    expect(formatLocalDate).toHaveBeenCalledTimes(2);
    expect(screen.getByText(/Created at: Formatted-Date/)).toBeInTheDocument();
    expect(screen.getByText(/Updated at: Formatted-Date/)).toBeInTheDocument();
  });

  it('renders playlist stats', () => {
    render(<PlaylistCard {...mockPlaylist} />);

    expect(screen.getByText('Total videos: 10')).toBeInTheDocument();
    expect(screen.getByText('Total categories: 3')).toBeInTheDocument();
  });

  it('renders the playlist type tag', () => {
    render(<PlaylistCard {...mockPlaylist} />);

    expect(screen.getByText(mockPlaylistType.name)).toBeInTheDocument();
  });
});
