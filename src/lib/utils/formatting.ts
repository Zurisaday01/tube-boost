import { PlaylistVideo, VideoData } from '@/types';
import { UncategorizedVideo } from '@/types/actions';


export const formatUncategorizedVideosToPlaylistVideos = (
  videos: UncategorizedVideo[]
): PlaylistVideo[] => {
  return videos.map((uncategorized: UncategorizedVideo) => ({
    id: uncategorized.id,
    playlistId: uncategorized.playlistId,
    videoId: uncategorized.videoId,
    youtubeVideoId: uncategorized.video.youtubeVideoId,
    subcategoryId: uncategorized.subcategoryId ?? null,
    orderIndex: uncategorized.orderIndex ?? 0,
    video: uncategorized.video as unknown as VideoData,
    addedAt: uncategorized.addedAt as Date
  }));
};
