// ============================================
// API: /api/history — Research History
// ============================================

import { NextRequest } from 'next/server';
import { getReports, getReportById } from '@/lib/db';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id || 'guest';
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const report = await getReportById(id);
    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }
    return Response.json(report);
  }

  const reports = await getReports(userId);
  return Response.json(reports);
}
