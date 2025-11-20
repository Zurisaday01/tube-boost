import { searchVideosAndPlaylists } from '@/lib/actions/search';

export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get('q') || '';
  const results = await searchVideosAndPlaylists(query);

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' }
  });
}
