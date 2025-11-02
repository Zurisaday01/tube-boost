import { getAllPlaylistTypesOptions } from '@/lib/actions/playlist-type';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getAllPlaylistTypesOptions();

  if (result.status === 'error') {
    const status = result.message === 'User not authenticated.' ? 401 : 500;
    return NextResponse.json({ message: result.message }, { status });
  }

  return NextResponse.json(result.data);
}
