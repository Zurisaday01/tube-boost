import VideoPageClient from '@/components/video/video-page-client';
import { getPlaylistVideoById } from '@/lib/actions/video';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = { params: Promise<{ id: string }> };

const VideoDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const response = await getPlaylistVideoById(id);

  if (!isSuccess(response)) {
    return <div>Failed to load video.</div>;
  }

  // Destructure the playlist video data
  const { id: playlistVideoId, video } = response.data;

  // Destructure necessary fields from the video object
  const { youtubeVideoId, channelTitle, title } = video;

  return (
    <VideoPageClient
      playlistVideoId={playlistVideoId}
      youtubeVideoId={youtubeVideoId}
      title={title}
      channelTitle={channelTitle}
    />
  );
};
export default VideoDetailsPage;
