// ============================================
// Alpha Vantage — Company Overview & Financials
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = 'https://www.alphavantage.co/query';

export interface AlphaVantageOverview {
  Symbol: string;
  Name: string;
  Description: string;
  Exchange: string;
  Currency: string;
  Country: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  PERatio: string;
  EPS: string;
  DividendYield: string;
  ProfitMargin: string;
  OperatingMarginTTM: string;
  ReturnOnEquityTTM: string;
  RevenueTTM: string;
  RevenuePerShareTTM: string;
  QuarterlyRevenueGrowthYOY: string;
  QuarterlyEarningsGrowthYOY: string;
  Beta: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  '50DayMovingAverage': string;
  '200DayMovingAverage': string;
  SharesOutstanding: string;
  BookValue: string;
  PriceToBookRatio: string;
  PriceToSalesRatioTTM: string;
  ForwardPE: string;
  PEGRatio: string;
  AnalystTargetPrice: string;
  AnalystRatingStrongBuy: string;
  AnalystRatingBuy: string;
  AnalystRatingHold: string;
  AnalystRatingSell: string;
  AnalystRatingStrongSell: string;
}

export async function getCompanyOverview(ticker: string): Promise<AlphaVantageOverview | null> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  if (!apiKey) return null;

  try {
    const url = `${BASE_URL}?function=OVERVIEW&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data?.Note || data?.Information) {
      console.warn('Alpha Vantage rate limit hit:', data.Note || data.Information);
      return null;
    }

    if (!data?.Symbol) return null;
    return data as AlphaVantageOverview;
  } catch (error) {
    console.error('Alpha Vantage overview error:', error);
    return null;
  }
}

export interface AlphaVantageEarnings {
  annualEarnings: { fiscalDateEnding: string; reportedEPS: string }[];
  quarterlyEarnings: { fiscalDateEnding: string; reportedEPS: string; estimatedEPS: string; surprise: string; surprisePercentage: string }[];
}

export async function getEarningsData(ticker: string): Promise<AlphaVantageEarnings | null> {
  const apiKey = process.env.ALPHA_VANTAGE_KEY;
  if (!apiKey) return null;

  try {
    const url = `${BASE_URL}?function=EARNINGS&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data?.Note || data?.Information) {
      console.warn('Alpha Vantage rate limit hit');
      return null;
    }

    if (!data?.annualEarnings) return null;
    return data as AlphaVantageEarnings;
  } catch (error) {
    console.error('Alpha Vantage earnings error:', error);
    return null;
  }
}

// Build enhanced context string from Alpha Vantage data
export function buildAlphaVantageContext(overview: AlphaVantageOverview | null, earnings: AlphaVantageEarnings | null): string {
  if (!overview) return '';

  const parts: string[] = ['=== ALPHA VANTAGE DATA ==='];

  parts.push(`Company: ${overview.Name} (${overview.Symbol})`);
  parts.push(`Sector: ${overview.Sector} | Industry: ${overview.Industry}`);
  parts.push(`Exchange: ${overview.Exchange} | Country: ${overview.Country}`);
  parts.push(`Description: ${overview.Description}`);

  // Valuation
  parts.push(`\nValuation Metrics:`);
  parts.push(`  Market Cap: $${overview.MarketCapitalization}`);
  parts.push(`  P/E Ratio: ${overview.PERatio}`);
  parts.push(`  Forward P/E: ${overview.ForwardPE}`);
  parts.push(`  PEG Ratio: ${overview.PEGRatio}`);
  parts.push(`  Price/Book: ${overview.PriceToBookRatio}`);
  parts.push(`  Price/Sales: ${overview.PriceToSalesRatioTTM}`);
  parts.push(`  EPS: $${overview.EPS}`);
  parts.push(`  Book Value: $${overview.BookValue}`);

  // Growth & Profitability
  parts.push(`\nGrowth & Profitability:`);
  parts.push(`  Revenue TTM: $${overview.RevenueTTM}`);
  parts.push(`  Quarterly Revenue Growth: ${overview.QuarterlyRevenueGrowthYOY}`);
  parts.push(`  Quarterly Earnings Growth: ${overview.QuarterlyEarningsGrowthYOY}`);
  parts.push(`  Profit Margin: ${overview.ProfitMargin}`);
  parts.push(`  Operating Margin: ${overview.OperatingMarginTTM}`);
  parts.push(`  ROE: ${overview.ReturnOnEquityTTM}`);

  // Price & Risk
  parts.push(`\nPrice & Risk:`);
  parts.push(`  52-Week High: $${overview['52WeekHigh']}`);
  parts.push(`  52-Week Low: $${overview['52WeekLow']}`);
  parts.push(`  50-Day MA: $${overview['50DayMovingAverage']}`);
  parts.push(`  200-Day MA: $${overview['200DayMovingAverage']}`);
  parts.push(`  Beta: ${overview.Beta}`);
  parts.push(`  Dividend Yield: ${overview.DividendYield}`);

  // Analyst Ratings
  const totalRatings = [overview.AnalystRatingStrongBuy, overview.AnalystRatingBuy, overview.AnalystRatingHold, overview.AnalystRatingSell, overview.AnalystRatingStrongSell]
    .map(Number).reduce((a, b) => a + b, 0);
  if (totalRatings > 0) {
    parts.push(`\nAnalyst Ratings (Total: ${totalRatings}):`);
    parts.push(`  Strong Buy: ${overview.AnalystRatingStrongBuy}`);
    parts.push(`  Buy: ${overview.AnalystRatingBuy}`);
    parts.push(`  Hold: ${overview.AnalystRatingHold}`);
    parts.push(`  Sell: ${overview.AnalystRatingSell}`);
    parts.push(`  Strong Sell: ${overview.AnalystRatingStrongSell}`);
    parts.push(`  Target Price: $${overview.AnalystTargetPrice}`);
  }

  // Recent earnings
  if (earnings?.quarterlyEarnings?.length) {
    parts.push(`\nRecent Quarterly Earnings:`);
    for (const q of earnings.quarterlyEarnings.slice(0, 4)) {
      parts.push(`  ${q.fiscalDateEnding}: Reported EPS $${q.reportedEPS} vs Est. $${q.estimatedEPS} (${Number(q.surprisePercentage) > 0 ? '+' : ''}${q.surprisePercentage}% surprise)`);
    }
  }

  return parts.join('\n');
}
