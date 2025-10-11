import VideoPageClient from '@/components/video/video-page-client';
import { getPlaylistVideoById } from '@/lib/actions/video';

type PageProps = { params: Promise<{ id: string }> };

const VideoDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const playlistVideo = await getPlaylistVideoById(id);

  if (!playlistVideo) {
    return <div>Video not found or you do not have access to it.</div>;
  }

  const {
    id: videoId,
    youtubeVideoId,
    channelTitle,
    duration,
    thumbnails,
    title
  } = playlistVideo.video;

  return (
    <VideoPageClient
      youtubeVideoId={youtubeVideoId}
      title={title}
      channelTitle={channelTitle}
    />
  );
};
export default VideoDetailsPage;
