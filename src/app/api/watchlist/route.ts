// ============================================
// API: /api/watchlist — Watchlist CRUD
// ============================================

import { NextRequest } from 'next/server';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/db';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || 'guest';
  const watchlist = await getWatchlist(userId);
  return Response.json(watchlist);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || 'guest';
  const body = await req.json();
  const { company, ticker } = body;

  if (!company || !ticker) {
    return Response.json({ error: 'Company and ticker are required' }, { status: 400 });
  }

  const item = await addToWatchlist(userId, company, ticker);
  return Response.json(item);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || 'guest';
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = await removeFromWatchlist(id, userId);
  if (!success) {
    return Response.json({ error: 'Item not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
