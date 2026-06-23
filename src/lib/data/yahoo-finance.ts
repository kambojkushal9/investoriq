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
