import { getAllPlaylistTypesOptions } from '@/lib/actions/playlist-type';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getAllPlaylistTypesOptions();

  if (result.status === 'error') {
    return NextResponse.json({ message: result.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
