// ============================================
// Market Data Cache — In-Memory TTL Cache
// ============================================
// Simple server-side cache to avoid hitting Yahoo Finance
// on every component render. No external infrastructure.

import type { MarketRange } from '@/lib/types';

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

// Cache TTL per range (in milliseconds)
const CACHE_TTL: Record<MarketRange, number> = {
  '1D':  60 * 1000,           // 1 minute
  '5D':  5 * 60 * 1000,       // 5 minutes
  '1M':  15 * 60 * 1000,      // 15 minutes
  '3M':  30 * 60 * 1000,      // 30 minutes
  '6M':  60 * 60 * 1000,      // 1 hour
  '1Y':  60 * 60 * 1000,      // 1 hour
  '5Y':  6 * 60 * 60 * 1000,  // 6 hours
  'MAX': 24 * 60 * 60 * 1000, // 24 hours
};

const cache = new Map<string, CacheEntry<unknown>>();

function buildKey(ticker: string, range: MarketRange): string {
  return `${ticker.toUpperCase()}:${range}`;
}

export function getCached<T>(ticker: string, range: MarketRange): T | null {
  const key = buildKey(ticker, range);
  const entry = cache.get(key);

  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function setCache<T>(ticker: string, range: MarketRange, data: T): void {
  const key = buildKey(ticker, range);
  const ttl = CACHE_TTL[range] || 15 * 60 * 1000;

  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });

  // Evict old entries periodically (keep cache bounded)
  if (cache.size > 200) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now > v.expiresAt) cache.delete(k);
    }
  }
}
