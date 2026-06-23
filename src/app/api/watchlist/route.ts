// ============================================
// API: /api/watchlist — Watchlist CRUD
// ============================================

import { NextRequest } from 'next/server';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '@/lib/db';

export async function GET() {
  const watchlist = getWatchlist();
  return Response.json(watchlist);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { company, ticker } = body;

  if (!company || !ticker) {
    return Response.json({ error: 'Company and ticker are required' }, { status: 400 });
  }

  const item = addToWatchlist(company, ticker);
  return Response.json(item);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return Response.json({ error: 'ID is required' }, { status: 400 });
  }

  const success = removeFromWatchlist(id);
  if (!success) {
    return Response.json({ error: 'Item not found' }, { status: 404 });
  }

  return Response.json({ success: true });
}
