// ============================================
// Yahoo Finance Data Wrapper (using yahoo-finance2 v3)
// ============================================

import type { FinancialMetrics } from '@/lib/types';
import YahooFinance from 'yahoo-finance2';

/* eslint-disable @typescript-eslint/no-explicit-any */

// Create a single YahooFinance instance (v3 API requires this)
const yf = new YahooFinance();

export async function searchTicker(query: string): Promise<{ name: string; ticker: string } | null> {
  try {
    const results: any = await yf.search(query, { quotesCount: 5 });
    const quote = results.quotes?.find(
      (q: any) => q.quoteType === 'EQUITY' && q.symbol
    );
    if (quote) {
      return {
        name: quote.shortname || quote.longname || query,
        ticker: quote.symbol,
      };
    }
    return null;
  } catch (error) {
    console.error('Yahoo Finance search error:', error);
    return null;
  }
}

export async function getQuote(ticker: string): Promise<FinancialMetrics | null> {
  try {
    const quote: any = await yf.quote(ticker);
    if (!quote) return null;

    return {
      marketCap: quote.marketCap || 0,
      currentPrice: quote.regularMarketPrice || 0,
      peRatio: quote.trailingPE || null,
      eps: quote.epsTrailingTwelvemonths || null,
      revenueGrowth: null,
      profitMargin: null,
      debtToEquity: null,
      freeCashFlow: null,
      dividendYield: quote.dividendYield || null,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || null,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || null,
      beta: null,
    };
  } catch (error) {
    console.error('Yahoo Finance quote error:', error);
    return null;
  }
}

export async function getDetailedFinancials(ticker: string): Promise<Partial<FinancialMetrics>> {
  try {
    const summary: any = await yf.quoteSummary(ticker, {
      modules: ['financialData', 'defaultKeyStatistics'],
    });

    const fd = summary.financialData;
    const ks = summary.defaultKeyStatistics;

    return {
      revenueGrowth: fd?.revenueGrowth || null,
      profitMargin: fd?.profitMargins || null,
      debtToEquity: fd?.debtToEquity || null,
      freeCashFlow: fd?.freeCashflow || null,
      beta: ks?.beta || null,
    };
  } catch (error) {
    console.error('Yahoo Finance detailed financials error:', error);
    return {};
  }
}

// ============================================
// Historical Market Data for Trading Chart
// ============================================

import type { MarketRange, OHLCVPoint, HistoricalMarketData } from '@/lib/types';

// Range → { period in days, interval }
const RANGE_CONFIG: Record<MarketRange, { days: number | null; interval: string }> = {
  '1D':  { days: 1,    interval: '5m'  },
  '5D':  { days: 5,    interval: '15m' },
  '1M':  { days: 30,   interval: '1d'  },
  '3M':  { days: 90,   interval: '1d'  },
  '6M':  { days: 180,  interval: '1d'  },
  '1Y':  { days: 365,  interval: '1d'  },
  '5Y':  { days: 1825, interval: '1wk' },
  'MAX': { days: null,  interval: '1mo' },
};

export async function getHistoricalData(
  ticker: string,
  range: MarketRange
): Promise<HistoricalMarketData> {
  const config = RANGE_CONFIG[range];
  if (!config) {
    throw new Error(`Invalid range: ${range}`);
  }

  const endDate = new Date();
  let startDate: Date;

  if (config.days === null) {
    // MAX: go back as far as possible
    startDate = new Date('1980-01-01');
  } else {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - config.days);
  }

  // Fetch historical + quote in parallel
  const [historical, quote] = await Promise.all([
    yf.historical(ticker, {
      period1: startDate,
      period2: endDate,
      interval: config.interval as any,
    }).catch(() => []),
    yf.quote(ticker).catch(() => null),
  ]);

  // Normalize OHLCV data
  const data: OHLCVPoint[] = (historical as any[])
    .filter((item: any) => item && item.date)
    .map((item: any) => ({
      timestamp: new Date(item.date).getTime(),
      open: safeNumber(item.open),
      high: safeNumber(item.high),
      low: safeNumber(item.low),
      close: safeNumber(item.close),
      volume: safeNumber(item.volume, 0),
    }))
    .filter((point: OHLCVPoint) =>
      point.close > 0 && isFinite(point.close) && point.timestamp > 0
    )
    .sort((a: OHLCVPoint, b: OHLCVPoint) => a.timestamp - b.timestamp);

  // Fill in any missing OHLC with close value
  for (const point of data) {
    if (!point.open || !isFinite(point.open)) point.open = point.close;
    if (!point.high || !isFinite(point.high)) point.high = point.close;
    if (!point.low || !isFinite(point.low)) point.low = point.close;
  }

  const quoteData = quote as any;

  return {
    ticker: ticker.toUpperCase(),
    currency: quoteData?.currency || 'USD',
    range,
    interval: config.interval,
    currentPrice: safeNumber(quoteData?.regularMarketPrice),
    previousClose: safeNumber(quoteData?.regularMarketPreviousClose),
    companyName: quoteData?.shortName || quoteData?.longName || ticker,
    data,
  };
}

function safeNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return isFinite(num) ? num : fallback;
}

