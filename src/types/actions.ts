import { Video, PlaylistVideo, Tag, VideoTag } from '@prisma/client';

// Use a generic type T to allow flexibility in the data returned
export interface ActionResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

export interface DeleteActionResponse {
  status: 'success' | 'error';
  message: string;
}

// Playlist Video Note type definition
export interface SaveNoteInput {
  playlistVideoId: string;
  document: string; // BlockNote document JSON
}

// Playlist with additional stats
export interface PlaylistWithStats {
  id: string;
  title: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  totalCategories: number;
  totalVideos: number;
}

// Subcategory with additional stats
export interface SubcategoryWithStats {
  id: string;
  playlistId: string;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  videos: PlaylistVideo[];
  totalVideos: number;
}

// To get the parent color of a tag's group
export interface TagWithGroupColor extends Tag {
  group: {
    color: string;
  };
}

export interface VideoTagWithTags extends VideoTag {
  tag: TagWithGroupColor;
}

export interface PlaylistVideoWithVideo extends PlaylistVideo {
  video: Video;
  videoTags: VideoTagWithTags[];
  
}

export interface ReorderVideosInput {
  playlistId: string;
  subcategoryId?: string;
  videoIds: string[]; // ordered array of playlistVideo IDs
}

// Tags
export interface TagWithCount extends Tag {
  totalVideos: number; // number of VideoTags associated with this tag
}

export interface VideoTagResponse extends VideoTag {
  tag: Tag;
}
