import VideoPageClient from '@/components/video/video-page-client';
import { getAllTagsOptions } from '@/lib/actions/tag';
import { getPlaylistVideoById } from '@/lib/actions/video';
import { isSuccess } from '@/lib/utils/actions';

type PageProps = { params: Promise<{ id: string }> };

const VideoDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  // Initiate both requests in parallel
  const [playlistVideoData, allTagsOptionsData] = await Promise.all([
    getPlaylistVideoById(id),
    getAllTagsOptions()
  ]);

  if (!isSuccess(playlistVideoData) || !isSuccess(allTagsOptionsData)) {
    return <div>Failed to load video.</div>;
  }

  // Destructure the playlist video data
  const { id: playlistVideoId, video, videoTags } = playlistVideoData.data;

  // Destructure necessary fields from the video object
  const { youtubeVideoId, channelTitle, title } = video;

  return (
    <VideoPageClient
      playlistVideoId={playlistVideoId}
      youtubeVideoId={youtubeVideoId}
      title={title}
      tagOptions={allTagsOptionsData.data}
      channelTitle={channelTitle}
      videoTags={videoTags}
    />
  );
};
export default VideoDetailsPage;
