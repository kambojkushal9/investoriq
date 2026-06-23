// ============================================
// API: /api/history — Research History
// ============================================

import { NextRequest } from 'next/server';
import { getReports, getReportById } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const report = getReportById(id);
    if (!report) {
      return Response.json({ error: 'Report not found' }, { status: 404 });
    }
    return Response.json(report);
  }

  const reports = getReports();
  return Response.json(reports);
}
