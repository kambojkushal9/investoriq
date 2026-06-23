// ============================================
// Tavily — AI-Optimized Web Search
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

const TAVILY_URL = 'https://api.tavily.com/search';

export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  published_date?: string;
}

export interface TavilyResponse {
  query: string;
  results: TavilySearchResult[];
  answer?: string;
}

export async function searchWeb(query: string, maxResults: number = 8): Promise<TavilyResponse | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(TAVILY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        search_depth: 'advanced',
        include_answer: true,
        include_domains: [
          'reuters.com', 'bloomberg.com', 'cnbc.com', 'wsj.com', 'ft.com',
          'seekingalpha.com', 'marketwatch.com', 'finance.yahoo.com',
          'investopedia.com', 'fool.com', 'barrons.com', 'forbes.com',
        ],
      }),
    });

    if (!res.ok) {
      console.warn('Tavily search error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data as TavilyResponse;
  } catch (error) {
    console.error('Tavily search error:', error);
    return null;
  }
}

export async function searchCompanyInfo(companyName: string, ticker: string): Promise<string> {
  const result = await searchWeb(`${companyName} (${ticker}) company overview business model products revenue 2024 2025`);
  if (!result) return '';

  const parts: string[] = ['=== WEB RESEARCH (via Tavily) ==='];

  if (result.answer) {
    parts.push(`\nAI Summary: ${result.answer}`);
  }

  for (const r of result.results.slice(0, 6)) {
    parts.push(`\n[${r.title}]`);
    parts.push(`  Source: ${r.url}`);
    parts.push(`  Content: ${r.content.substring(0, 300)}`);
  }

  return parts.join('\n');
}

export async function searchCompanySentiment(companyName: string, ticker: string): Promise<string> {
  const result = await searchWeb(`${companyName} ${ticker} stock investor sentiment analyst opinion reddit 2025`);
  if (!result) return '';

  const parts: string[] = ['=== MARKET SENTIMENT WEB DATA (via Tavily) ==='];

  if (result.answer) {
    parts.push(`\nAI Summary: ${result.answer}`);
  }

  for (const r of result.results.slice(0, 5)) {
    parts.push(`\n[${r.title}]`);
    parts.push(`  ${r.content.substring(0, 250)}`);
  }

  return parts.join('\n');
}

export async function searchCompanyRisks(companyName: string, ticker: string): Promise<string> {
  const result = await searchWeb(`${companyName} ${ticker} risks challenges regulatory concerns lawsuits 2025`);
  if (!result) return '';

  const parts: string[] = ['=== RISK INTELLIGENCE (via Tavily) ==='];

  if (result.answer) {
    parts.push(`\nAI Summary: ${result.answer}`);
  }

  for (const r of result.results.slice(0, 5)) {
    parts.push(`\n[${r.title}]`);
    parts.push(`  ${r.content.substring(0, 250)}`);
  }

  return parts.join('\n');
}
