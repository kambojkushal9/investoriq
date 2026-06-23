// ============================================
// Finnhub — Real-time Quotes, News & Analyst Data
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = 'https://finnhub.io/api/v1';

function finnhubFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const apiKey = process.env.FINNHUB_KEY;
  if (!apiKey) return Promise.resolve(null);

  const searchParams = new URLSearchParams({ ...params, token: apiKey });
  return fetch(`${BASE_URL}${endpoint}?${searchParams}`, { next: { revalidate: 300 } })
    .then(res => {
      if (!res.ok) throw new Error(`Finnhub error: ${res.status}`);
      return res.json();
    })
    .catch(error => {
      console.error(`Finnhub ${endpoint} error:`, error);
      return null;
    });
}

// ---- Company Profile ----

export interface FinnhubProfile {
  country: string;
  currency: string;
  estimateCurrency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

export async function getCompanyProfile(ticker: string): Promise<FinnhubProfile | null> {
  const data = await finnhubFetch('/stock/profile2', { symbol: ticker });
  if (!data?.name) return null;
  return data as FinnhubProfile;
}

// ---- Company News ----

export interface FinnhubNewsItem {
  category: string;
  datetime: number;
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export async function getCompanyNews(ticker: string, daysBack: number = 14): Promise<FinnhubNewsItem[]> {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - daysBack);

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const data = await finnhubFetch('/company-news', {
    symbol: ticker,
    from: formatDate(from),
    to: formatDate(to),
  });

  if (!Array.isArray(data)) return [];
  return data.slice(0, 20) as FinnhubNewsItem[];
}

// ---- Analyst Recommendations ----

export interface FinnhubRecommendation {
  buy: number;
  hold: number;
  period: string;
  sell: number;
  strongBuy: number;
  strongSell: number;
  symbol: string;
}

export async function getRecommendationTrends(ticker: string): Promise<FinnhubRecommendation[]> {
  const data = await finnhubFetch('/stock/recommendation', { symbol: ticker });
  if (!Array.isArray(data)) return [];
  return data.slice(0, 4) as FinnhubRecommendation[];
}

// ---- Basic Financials ----

export interface FinnhubFinancials {
  metric: {
    '10DayAverageTradingVolume'?: number;
    '52WeekHigh'?: number;
    '52WeekLow'?: number;
    '52WeekHighDate'?: string;
    '52WeekLowDate'?: string;
    beta?: number;
    currentRatioAnnual?: number;
    currentRatioQuarterly?: number;
    dividendYieldIndicatedAnnual?: number;
    epsAnnual?: number;
    epsGrowth3Y?: number;
    epsGrowth5Y?: number;
    epsGrowthTTMYoy?: number;
    freeCashFlowAnnual?: number;
    freeCashFlowPerShareTTM?: number;
    grossMarginAnnual?: number;
    grossMarginTTM?: number;
    netProfitMarginAnnual?: number;
    netProfitMarginTTM?: number;
    operatingMarginAnnual?: number;
    operatingMarginTTM?: number;
    peAnnual?: number;
    peBasicExclExtraTTM?: number;
    pbAnnual?: number;
    pbQuarterly?: number;
    psTTM?: number;
    revenueGrowth3Y?: number;
    revenueGrowth5Y?: number;
    revenueGrowthTTMYoy?: number;
    roaAnnual?: number;
    roaeTTM?: number;
    roeAnnual?: number;
    roeTTM?: number;
    totalDebtToEquityAnnual?: number;
    totalDebtToEquityQuarterly?: number;
    [key: string]: number | string | undefined;
  };
}

export async function getBasicFinancials(ticker: string): Promise<FinnhubFinancials | null> {
  const data = await finnhubFetch('/stock/metric', { symbol: ticker, metric: 'all' });
  if (!data?.metric) return null;
  return data as FinnhubFinancials;
}

// ---- Peers / Competitors ----

export async function getCompanyPeers(ticker: string): Promise<string[]> {
  const data = await finnhubFetch('/stock/peers', { symbol: ticker });
  if (!Array.isArray(data)) return [];
  return data.filter((s: string) => s !== ticker).slice(0, 8);
}

// ---- Build context strings for agents ----

export function buildFinnhubNewsContext(news: FinnhubNewsItem[]): string {
  if (!news.length) return '';

  const parts: string[] = ['=== REAL-TIME NEWS (via Finnhub) ==='];
  for (const article of news.slice(0, 10)) {
    const date = new Date(article.datetime * 1000).toISOString().split('T')[0];
    parts.push(`\n[${date}] ${article.headline}`);
    parts.push(`  Source: ${article.source}`);
    if (article.summary) {
      parts.push(`  Summary: ${article.summary.substring(0, 200)}...`);
    }
    parts.push(`  URL: ${article.url}`);
  }
  return parts.join('\n');
}

export function buildFinnhubFinancialsContext(financials: FinnhubFinancials | null): string {
  if (!financials?.metric) return '';

  const m = financials.metric;
  const parts: string[] = ['=== FINNHUB FINANCIAL METRICS ==='];

  parts.push(`Profitability:`);
  if (m.grossMarginTTM != null) parts.push(`  Gross Margin TTM: ${(m.grossMarginTTM as number).toFixed(2)}%`);
  if (m.netProfitMarginTTM != null) parts.push(`  Net Profit Margin TTM: ${(m.netProfitMarginTTM as number).toFixed(2)}%`);
  if (m.operatingMarginTTM != null) parts.push(`  Operating Margin TTM: ${(m.operatingMarginTTM as number).toFixed(2)}%`);
  if (m.roeTTM != null) parts.push(`  ROE TTM: ${(m.roeTTM as number).toFixed(2)}%`);
  if (m.roaeTTM != null) parts.push(`  ROA TTM: ${(m.roaeTTM as number).toFixed(2)}%`);

  parts.push(`Growth:`);
  if (m.revenueGrowthTTMYoy != null) parts.push(`  Revenue Growth YoY: ${(m.revenueGrowthTTMYoy as number).toFixed(2)}%`);
  if (m.epsGrowthTTMYoy != null) parts.push(`  EPS Growth YoY: ${(m.epsGrowthTTMYoy as number).toFixed(2)}%`);
  if (m.revenueGrowth3Y != null) parts.push(`  Revenue Growth 3Y CAGR: ${(m.revenueGrowth3Y as number).toFixed(2)}%`);
  if (m.revenueGrowth5Y != null) parts.push(`  Revenue Growth 5Y CAGR: ${(m.revenueGrowth5Y as number).toFixed(2)}%`);

  parts.push(`Valuation:`);
  if (m.peBasicExclExtraTTM != null) parts.push(`  P/E TTM: ${(m.peBasicExclExtraTTM as number).toFixed(2)}`);
  if (m.pbQuarterly != null) parts.push(`  P/B Quarterly: ${(m.pbQuarterly as number).toFixed(2)}`);
  if (m.psTTM != null) parts.push(`  P/S TTM: ${(m.psTTM as number).toFixed(2)}`);

  parts.push(`Balance Sheet:`);
  if (m.currentRatioQuarterly != null) parts.push(`  Current Ratio: ${(m.currentRatioQuarterly as number).toFixed(2)}`);
  if (m.totalDebtToEquityQuarterly != null) parts.push(`  Debt/Equity: ${(m.totalDebtToEquityQuarterly as number).toFixed(2)}`);

  if (m.freeCashFlowPerShareTTM != null) parts.push(`  Free Cash Flow/Share TTM: $${(m.freeCashFlowPerShareTTM as number).toFixed(2)}`);
  if (m.beta != null) parts.push(`  Beta: ${(m.beta as number).toFixed(2)}`);

  return parts.join('\n');
}

export function buildRecommendationsContext(recs: FinnhubRecommendation[]): string {
  if (!recs.length) return '';

  const parts: string[] = ['=== ANALYST RECOMMENDATIONS (via Finnhub) ==='];
  for (const r of recs) {
    const total = r.strongBuy + r.buy + r.hold + r.sell + r.strongSell;
    parts.push(`Period: ${r.period} (${total} analysts)`);
    parts.push(`  Strong Buy: ${r.strongBuy} | Buy: ${r.buy} | Hold: ${r.hold} | Sell: ${r.sell} | Strong Sell: ${r.strongSell}`);
  }
  return parts.join('\n');
}
