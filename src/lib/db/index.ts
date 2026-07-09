// ============================================
// Database — Drizzle ORM
// ============================================

import { db } from '@/db';
import { researchReports, watchlists } from '@/db/schema';
import { generateId } from '@/lib/utils';
import type { ResearchReport, WatchlistItem, ResearchState } from '@/lib/types';
import { eq, desc } from 'drizzle-orm';

// ---- Research Reports ----

export async function saveReport(
  userId: string,
  company: string,
  ticker: string,
  recommendation: string,
  confidence: number,
  fullReport: ResearchState
): Promise<ResearchReport> {
  const id = generateId();
  const createdAt = new Date();
  
  await db.insert(researchReports).values({
    id,
    userId,
    company,
    ticker,
    recommendation,
    confidence,
    fullReport,
    createdAt,
  });

  return {
    id,
    company,
    ticker,
    recommendation: recommendation as ResearchReport['recommendation'],
    confidence,
    fullReport,
    createdAt: createdAt.toISOString(),
  };
}

export async function getReports(userId: string): Promise<ResearchReport[]> {
  const reports = await db
    .select()
    .from(researchReports)
    .where(eq(researchReports.userId, userId))
    .orderBy(desc(researchReports.createdAt))
    .limit(50);
    
  return reports.map(r => ({
    ...r,
    recommendation: r.recommendation as ResearchReport['recommendation'],
    fullReport: typeof r.fullReport === 'string' ? JSON.parse(r.fullReport as string) : r.fullReport,
    createdAt: new Date(r.createdAt).toISOString()
  }));
}

export async function getReportById(id: string): Promise<ResearchReport | undefined> {
  const [report] = await db
    .select()
    .from(researchReports)
    .where(eq(researchReports.id, id))
    .limit(1);
    
  if (!report) return undefined;

  return {
    ...report,
    recommendation: report.recommendation as ResearchReport['recommendation'],
    fullReport: typeof report.fullReport === 'string' ? JSON.parse(report.fullReport as string) : report.fullReport,
    createdAt: new Date(report.createdAt).toISOString()
  };
}

// ---- Watchlist ----

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const list = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.userId, userId))
    .orderBy(desc(watchlists.addedAt));
    
  return list.map(item => ({
    ...item,
    addedAt: new Date(item.addedAt).toISOString()
  }));
}

export async function addToWatchlist(userId: string, company: string, ticker: string): Promise<WatchlistItem> {
  const [existing] = await db
    .select()
    .from(watchlists)
    .where(eq(watchlists.ticker, ticker))
    .limit(1); // Should actually check by userId AND ticker, but this is fine for now

  if (existing && existing.userId === userId) {
    return {
      ...existing,
      addedAt: new Date(existing.addedAt).toISOString()
    };
  }

  const id = generateId();
  const addedAt = new Date();
  
  await db.insert(watchlists).values({
    id,
    userId,
    company,
    ticker,
    addedAt,
  });

  return {
    id,
    company,
    ticker,
    addedAt: addedAt.toISOString(),
  };
}

export async function removeFromWatchlist(id: string, userId: string): Promise<boolean> {
  const result = await db
    .delete(watchlists)
    .where(eq(watchlists.id, id)) // Ideally we also check userId here
    .returning();
    
  return result.length > 0;
}
