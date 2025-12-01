import { render, screen } from '@testing-library/react';
import PlaylistsList from '../playlists-list';
import PlaylistCard from '../playlist-card';

// Mock PlaylistCard to test in isolation
jest.mock('../playlist-card', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid='playlist-card' />)
}));

const MockedPlaylistCard = PlaylistCard as jest.Mock;

/*
Component responsibility:
PlaylistsList receives a list of playlists and decides what to render.
It shows an empty-state message when the list is empty, otherwise it maps
each playlist into a PlaylistCard, forwarding the expected props.
*/

describe('PlaylistsList', () => {
  // Mock playlist data
  const mockPlaylists = [
    {
      id: '1',
      title: 'Playlist A',
      source: 'youtube',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-05'),
      totalCategories: 4,
      totalVideos: 12,
      playlistType: null
    },
    {
      id: '2',
      title: 'Playlist B',
      source: 'youtube',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-10'),
      totalCategories: 2,
      totalVideos: 5,
      playlistType: null
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the correct number of PlaylistCard components', () => {
    render(<PlaylistsList playlists={mockPlaylists} />);

    const cards = screen.getAllByTestId('playlist-card');
    expect(cards.length).toBe(2);
  });

  test('renders a message if playlists is empty (handled inside component)', () => {
    render(<PlaylistsList playlists={[]} />);

    // The message should be rendered
    const emptyMessage = screen.getByText('Put together a playlist!');
    expect(emptyMessage).toBeInTheDocument();

    // The card should not be rendered
    expect(screen.queryByTestId('playlist-card')).toBeNull();
  });

  test('passes correct props to PlaylistCard', () => {
    render(<PlaylistsList playlists={mockPlaylists} />);
    const firstCallProps = MockedPlaylistCard.mock.calls[0][0];
    const secondCallProps = MockedPlaylistCard.mock.calls[1][0];

    expect(firstCallProps).toEqual(
      expect.objectContaining({
        id: '1',
        title: 'Playlist A',
        playlistType: null,
        totalVideos: 12,
        totalCategories: 4,
        createdAt: mockPlaylists[0].createdAt,
        updatedAt: mockPlaylists[0].updatedAt
      })
    );

    expect(secondCallProps).toEqual(
      expect.objectContaining({
        id: '2',
        title: 'Playlist B',
        playlistType: null,
        totalVideos: 5,
        totalCategories: 2,
        createdAt: mockPlaylists[1].createdAt,
        updatedAt: mockPlaylists[1].updatedAt
      })
    );
  });

  // Snapshot test
  test('matches snapshot', () => {
    const { container } = render(<PlaylistsList playlists={mockPlaylists} />);
    expect(container).toMatchSnapshot();
  });
});
