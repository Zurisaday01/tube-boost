import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type ComboboxDataItem = {
  value: string;
  label: string;
};

interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoThumbnails {
  default: VideoThumbnail;
  medium: VideoThumbnail;
  high: VideoThumbnail;
  standard?: VideoThumbnail; // optional, may not exist for all videos
  maxres?: VideoThumbnail; // optional, may not exist for all videos
}

export interface VideoData {
  youtubeVideoId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  duration: number; // in seconds
  thumbnails: VideoThumbnails;
}

export type Subcategory = {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  playlistId: string;
  orderIndex: number;
  playlist?: { title: string };
};

export interface InformationSheetDetails {
  modified: Date;
  created: Date;
  location?: string;
}

export interface PlaylistVideo {
  id: string;
  playlistId: string;
  videoId: string;
  youtubeVideoId: string;
  subcategoryId: string | null;
  orderIndex: number;
  addedAt: Date;
  video: VideoData;
}

export interface PlaylistTypeOptions {
  value: string;
  label: string;
}

// Needed for search results typing
export interface SearchedPlaylistVideo {
  id: string;
  video: {
    title: string;
  };
  playlist: {
    title: string;
  };
  note?: {
    searchableText: string;
  };
}

export interface SearchedPlaylist {
  id: string;
  title: string;
}

export interface SearchResults {
  playlistVideos: SearchedPlaylistVideo[];
  playlists: SearchedPlaylist[];
}
