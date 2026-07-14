'use client';

// ============================================
// useMarketData — React Hook for Trading Chart
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  MarketRange,
  OHLCVPoint,
  HistoricalMarketData,
  ChartSummary,
  ChartAnomalyMarker,
} from '@/lib/types';

interface MarketDataResponse extends HistoricalMarketData {
  summary: ChartSummary | null;
  anomalies: ChartAnomalyMarker[];
  cached: boolean;
}

interface UseMarketDataReturn {
  range: MarketRange;
  setRange: (range: MarketRange) => void;
  data: MarketDataResponse | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// Client-side cache to avoid refetch on range back-toggle
const clientCache = new Map<string, { data: MarketDataResponse; fetchedAt: number }>();
const CLIENT_CACHE_TTL = 30_000; // 30 seconds

export function useMarketData(ticker: string | null): UseMarketDataReturn {
  const [range, setRange] = useState<MarketRange>('1Y');
  const [data, setData] = useState<MarketDataResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (tickerVal: string, rangeVal: MarketRange) => {
    // Check client cache
    const cacheKey = `${tickerVal}:${rangeVal}`;
    const cached = clientCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CLIENT_CACHE_TTL) {
      setData(cached.data);
      setError(null);
      return;
    }

    // Abort previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/market/chart?symbol=${encodeURIComponent(tickerVal)}&range=${rangeVal}`,
        { signal: controller.signal }
      );

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Failed to fetch market data (${res.status})`);
      }

      const result: MarketDataResponse = await res.json();
      setData(result);

      // Update client cache
      clientCache.set(cacheKey, { data: result, fetchedAt: Date.now() });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError((err as Error).message || 'Failed to load market data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on ticker/range change
  useEffect(() => {
    if (ticker) {
      fetchData(ticker, range);
    } else {
      setData(null);
      setError(null);
    }
  }, [ticker, range, fetchData]);

  const refetch = useCallback(() => {
    if (ticker) {
      // Clear client cache for this ticker+range
      clientCache.delete(`${ticker}:${range}`);
      fetchData(ticker, range);
    }
  }, [ticker, range, fetchData]);

  return { range, setRange, data, isLoading, error, refetch };
}
