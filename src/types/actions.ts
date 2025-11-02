import {
  Video,
  Tag,
  VideoTag,
  PlaylistVideo as PlaylistVideoDB,
  Prisma,
  PlaylistType,
  TagGroup
} from '@prisma/client';
import { VideoThumbnails } from '.';

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
  playlistType: null | PlaylistType;
}


// -----------------------------------------------------------------------------------
// This type represents a video record from the database and components are using it so we need to strong type the json hanced we define VideoWithParsedThumbnails
type VideoDB = Prisma.VideoGetPayload<{}>;
export interface VideoWithParsedThumbnails extends Omit<VideoDB, 'thumbnails'> {
  // Parse thumbnails JSON string into an object
  thumbnails: VideoThumbnails;
}
export interface PlaylistVideoIncludeVideo extends PlaylistVideoDB {
  video: VideoWithParsedThumbnails;
}
// -----------------------------------------------------------------------------------

export interface PlaylistWithStatsAndUncategorizedVideos
  extends PlaylistWithStats {
  uncategorizedPlaylistVideos: PlaylistVideoIncludeVideo[];
}

// Subcategory with additional stats
export interface SubcategoryWithStats {
  id: string;
  playlistId: string;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  videos: PlaylistVideoIncludeVideo[];
  totalVideos: number;
}




export interface PlaylistVideoWithVideo extends PlaylistVideoDB {
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

export interface TagWithGroup extends Tag {
  group: TagGroup
}

export interface VideoTagWithTag extends VideoTag {
  tag: TagWithGroup;
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