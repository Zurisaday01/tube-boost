import PageContainer from '@/components/layout/page-container';
import { getAuthSource } from '@/lib/utils';
import Link from 'next/link';

const TermsPage = async ({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  // Await the search parameters
  const queries = await searchParams;

  // Get the 'from' query parameter if it exists
  const from = getAuthSource(queries.from);

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
        <article className='space-y-1'>
          <h1 className='text-primary text-3xl font-semibold mb-4'>
            Terms of Service
          </h1>
          <h2 className='text-primary text-xl font-semibold'>
            Service Description
          </h2>
          <p>
            TubeBoost is a video organization and note-taking platform built on
            top of YouTube content. It allows users to organize videos into
            playlists, subcategories, tags, and notes, including timestamp-based
            references.
          </p>
          <p>TubeBoost does not host or distribute video content.</p>
        </article>

        <article className='space-y-1'>
          <h2 className='text-primary text-xl font-semibold'>
            YouTube Content & Metadata
          </h2>
          <p>
            Videos added to TubeBoost are referenced using YouTube video IDs.
          </p>
          <p>TubeBoost:</p>
          <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
            <li>
              Stores limited public metadata retrieved via the YouTube API
            </li>
            <li>Uses metadata solely for display, organization, and caching</li>
            <li>
              Does not guarantee video availability, accuracy, or permanence
            </li>
          </ul>
          <p>
            Videos remain subject to YouTube’s Terms of Service and
            availability.
          </p>
        </article>
        <article className='space-y-1'>
          <h2 className='text-primary text-xl font-semibold'>User Content</h2>
          <p>
            You retain ownership of all content you create in TubeBoost,
            including:
          </p>
          <ul className='list-disc pl-5 space-y-1 leading-relaxed'>
            <li>Notes and blog documents</li>
            <li>Tags and tag groups</li>
            <li>Playlists and organizational structures</li>
          </ul>
          <p>
            You are responsible for the content you store and organize within
            the platform.
          </p>
        </article>
        <article className='space-y-1'>
          <h2 className='text-primary text-xl font-semibold'>
            Caching & Shared Metadata
          </h2>
          <p>
            For performance reasons, TubeBoost may reuse stored video metadata
            across users when the same YouTube video is referenced. This does
            not grant access to other users' notes, playlists, or personal data.
          </p>
        </article>
        <article className='space-y-1 pb-10'>
          <h2 className='text-primary text-xl font-semibold'>
            Account Security
          </h2>
          <p>
            You are responsible for safeguarding your login credentials.
            TubeBoost is not responsible for unauthorized access resulting from
            compromised credentials.
          </p>
        </article>
      </section>
    </PageContainer>
  );
};
export default TermsPage;
