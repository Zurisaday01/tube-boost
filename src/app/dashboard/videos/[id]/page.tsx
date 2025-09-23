type PageProps = { params: Promise<{ id: string }> };

const VideoDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  return <div>VideoDetailsPage {id}</div>;
};
export default VideoDetailsPage;
