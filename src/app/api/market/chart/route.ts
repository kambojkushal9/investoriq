// ============================================
// API: /api/market/chart — Historical Market Data
// ============================================
// Multi-range OHLCV endpoint with caching.
// Reuses the shared Yahoo Finance singleton.

import { NextResponse } from 'next/server';
import { getHistoricalData } from '@/lib/data/yahoo-finance';
import { getCached, setCache } from '@/lib/data/market-cache';
import { computeChartSummary, detectAnomalies } from '@/lib/chart-analytics';
import type { MarketRange, HistoricalMarketData, MARKET_RANGES } from '@/lib/types';

const VALID_RANGES: MarketRange[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.trim().toUpperCase();
  const rangeParam = (searchParams.get('range') || '1Y').toUpperCase() as MarketRange;

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  if (!VALID_RANGES.includes(rangeParam)) {
    return NextResponse.json(
      { error: `Invalid range. Valid ranges: ${VALID_RANGES.join(', ')}` },
      { status: 400 }
    );
  }

  try {
    // Check cache first
    const cached = getCached<HistoricalMarketData>(symbol, rangeParam);
    if (cached) {
      const summary = computeChartSummary(cached.data);
      const anomalies = detectAnomalies(cached.data);
      return NextResponse.json({
        ...cached,
        summary,
        anomalies,
        cached: true,
      });
    }

    // Fetch from Yahoo Finance
    const marketData = await getHistoricalData(symbol, rangeParam);

    if (!marketData.data || marketData.data.length === 0) {
      return NextResponse.json(
        { error: `No historical data available for ${symbol} in range ${rangeParam}` },
        { status: 404 }
      );
    }

    // Cache the result
    setCache(symbol, rangeParam, marketData);

    // Compute analytics
    const summary = computeChartSummary(marketData.data);
    const anomalies = detectAnomalies(marketData.data);

    return NextResponse.json({
      ...marketData,
      summary,
      anomalies,
      cached: false,
    });
  } catch (error) {
    console.error('Chart API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
