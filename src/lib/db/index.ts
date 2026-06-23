// ============================================
// Database — SQLite with JSON file fallback
// ============================================

import { generateId } from '@/lib/utils';
import type { ResearchReport, WatchlistItem, ResearchState } from '@/lib/types';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), '.data');
const REPORTS_FILE = path.join(DB_DIR, 'reports.json');
const WATCHLIST_FILE = path.join(DB_DIR, 'watchlist.json');

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string): T[] {
  ensureDir();
  if (!fs.existsSync(filePath)) return [];
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON<T>(filePath: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ---- Research Reports ----

export function saveReport(
  company: string,
  ticker: string,
  recommendation: string,
  confidence: number,
  fullReport: ResearchState
): ResearchReport {
  const reports = readJSON<ResearchReport>(REPORTS_FILE);
  const report: ResearchReport = {
    id: generateId(),
    company,
    ticker,
    recommendation: recommendation as ResearchReport['recommendation'],
    confidence,
    fullReport,
    createdAt: new Date().toISOString(),
  };
  reports.unshift(report);
  // Keep only last 50
  if (reports.length > 50) reports.length = 50;
  writeJSON(REPORTS_FILE, reports);
  return report;
}

export function getReports(): ResearchReport[] {
  return readJSON<ResearchReport>(REPORTS_FILE);
}

export function getReportById(id: string): ResearchReport | undefined {
  const reports = readJSON<ResearchReport>(REPORTS_FILE);
  return reports.find(r => r.id === id);
}

// ---- Watchlist ----

export function getWatchlist(): WatchlistItem[] {
  return readJSON<WatchlistItem>(WATCHLIST_FILE);
}

export function addToWatchlist(company: string, ticker: string): WatchlistItem {
  const watchlist = readJSON<WatchlistItem>(WATCHLIST_FILE);
  // Check if already exists
  const existing = watchlist.find(w => w.ticker === ticker);
  if (existing) return existing;

  const item: WatchlistItem = {
    id: generateId(),
    company,
    ticker,
    addedAt: new Date().toISOString(),
  };
  watchlist.unshift(item);
  writeJSON(WATCHLIST_FILE, watchlist);
  return item;
}

export function removeFromWatchlist(id: string): boolean {
  const watchlist = readJSON<WatchlistItem>(WATCHLIST_FILE);
  const idx = watchlist.findIndex(w => w.id === id);
  if (idx === -1) return false;
  watchlist.splice(idx, 1);
  writeJSON(WATCHLIST_FILE, watchlist);
  return true;
}
