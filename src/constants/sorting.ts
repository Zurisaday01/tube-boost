// Sorting options for playlists (playlist toolbar)
export const playlistSortOptions = [
  { id: 'default', label: 'Newest created (default)' },
  { id: 'created-asc', label: 'Oldest created' },
  { id: 'updated-desc', label: 'Recently updated' },
  { id: 'title-asc', label: 'Title A - Z' },
  { id: 'title-desc', label: 'Title Z - A' },
  { id: 'videos-desc', label: 'Most videos' },
  { id: 'videos-asc', label: 'Least videos' }
];

// Sorting mapper to convert sortBy param to Prisma orderBy object
export const playlistOrderByMap: Record<string, any> = {
  default: { createdAt: 'desc' },
  'created-asc': { createdAt: 'asc' },
  'updated-desc': { updatedAt: 'desc' },
  'title-asc': { title: 'asc' },
  'title-desc': { title: 'desc' },
  'videos-desc': { videos: { _count: 'desc' } },
  'videos-asc': { videos: { _count: 'asc' } }
};
