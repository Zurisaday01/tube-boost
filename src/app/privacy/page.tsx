import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';

const PrivacyPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Await the search parameters
  const queries = await searchParams;

  // Get the 'from' query parameter if it exists
  const from = queries['from'] || 'sign-in';

  return (
    <PageContainer fullHeight>
      <section className='space-y-4 h-screen w-full max-w-7xl mx-auto py-8 px-4'>
        <div>
          <Link
            href={`/auth/${from}`}
            className='hover:text-primary text-muted-foreground underline underline-offset-4'
          >
            Back to {from === 'sign-up' ? 'Sign Up' : 'Sign In'}
          </Link>
        </div>
        <article className='space-y-4'>
          <div className='space-y-1'>
            <h1 className='text-primary text-3xl font-semibold mb-4'>
              Privacy Policy
            </h1>
            <h2 className='text-primary text-xl font-semibold'>
              Information We Collect
            </h2>
            <h3 className='text-primary text-lg font-semibold'>
              Account & Authentication Data
            </h3>
            <p>We store the following account-related information:</p>
            <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
              <li>Name, first name, last name</li>
              <li>Email address</li>
              <li>Encrypted password (if applicable)</li>
              <li>Authentication-related tokens and session data</li>
              <li>Optional profile image</li>
            </ul>
            <p>
              This data is required to authenticate users and secure access to
              TubeBoost.
            </p>
          </div>
          <div className='space-y-1'>
            <h3 className='text-primary text-lg font-semibold'>
              YouTube Video Data (Metadata Only)
            </h3>
            <p>
              TubeBoost allows users to add videos by pasting a YouTube video ID
              or shareable URL.
            </p>
            <p>
              When a video is added, TubeBoost retrieves and stores limited
              public metadata from the YouTube API, including:
            </p>
            <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
              <li>YouTube video ID</li>
              <li>Video title</li>
              <li>Channel ID and channel title</li>
              <li>Duration (when available)</li>
              <li>Thumbnail URLs</li>
            </ul>
            <p>
              TubeBoost does not store video files and does not download or
              re-host video content.
            </p>
            <p>
              To improve performance, video metadata may be cached and shared
              across users when multiple users reference the same YouTube video.
            </p>
            <p>
              If a video is no longer referenced by any user, its metadata may
              be removed from the database.
            </p>
          </div>
          <div className='space-y-1'>
            <h3 className='text-primary text-lg font-semibold'>
              User-Generated Content
            </h3>
            <p>
              We store content created by users inside TubeBoost, including:
            </p>
            <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
              <li>Playlists and playlist structure</li>
              <li>Subcategories (folders)</li>
              <li>Notes and blog-style documents</li>
              <li>Timestamped references</li>
              <li>Tags and tag groups</li>
              <li>Playlist-specific and video-specific annotations</li>
              <li>Channel-based tagging rules</li>
            </ul>
            <p>
              This data exists only to provide TubeBoost's organizational and
              note-taking features.
            </p>
          </div>
        </article>

        <article className='space-y-1'>
          <h2 className='text-primary text-xl font-semibold'>
            What We Do NOT Access
          </h2>
          <p>TubeBoost does not:</p>
          <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
            <li>Access your YouTube account</li>
            <li>Read private YouTube data</li>
            <li>Modify YouTube content</li>
            <li>Post on your behalf</li>
          </ul>
          <p>
            All YouTube data used by TubeBoost comes from public API responses
            based on video IDs supplied by users.
          </p>
        </article>
        <article className='space-y-1 pb-10'>
          <h2 className='text-primary text-xl font-semibold'>Data Retention</h2>
          <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
            <li>
              Account and user-generated data is stored until deleted by the
              user or account removal
            </li>
            <li>
              Video metadata is retained only while referenced by at least one
              user
            </li>
            <li>
              When an account is deleted, associated playlists, notes, tags, and
              rules are removed
            </li>
          </ul>
        </article>
      </section>
    </PageContainer>
  );
};
export default PrivacyPage;
