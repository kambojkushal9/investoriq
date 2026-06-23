// ============================================
// News API — Real News Articles
// ============================================

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = 'https://newsapi.org/v2';

export interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export async function searchNews(query: string, pageSize: number = 10): Promise<NewsAPIArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    // Search for news in the last 14 days
    const from = new Date();
    from.setDate(from.getDate() - 14);
    const fromStr = from.toISOString().split('T')[0];

    const params = new URLSearchParams({
      q: query,
      from: fromStr,
      sortBy: 'relevancy',
      pageSize: String(pageSize),
      language: 'en',
      apiKey,
    });

    const res = await fetch(`${BASE_URL}/everything?${params}`, { next: { revalidate: 1800 } });
    const data = await res.json();

    if (data.status !== 'ok') {
      console.warn('News API error:', data.message || data.code);
      return [];
    }

    return (data.articles || []).filter(
      (a: NewsAPIArticle) => a.title && a.title !== '[Removed]'
    ) as NewsAPIArticle[];
  } catch (error) {
    console.error('News API search error:', error);
    return [];
  }
}

export async function getTopHeadlines(query: string, pageSize: number = 5): Promise<NewsAPIArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      pageSize: String(pageSize),
      language: 'en',
      apiKey,
    });

    const res = await fetch(`${BASE_URL}/top-headlines?${params}`, { next: { revalidate: 1800 } });
    const data = await res.json();

    if (data.status !== 'ok') {
      console.warn('News API headlines error:', data.message || data.code);
      return [];
    }

    return (data.articles || []).filter(
      (a: NewsAPIArticle) => a.title && a.title !== '[Removed]'
    ) as NewsAPIArticle[];
  } catch (error) {
    console.error('News API headlines error:', error);
    return [];
  }
}

export function buildNewsContext(articles: NewsAPIArticle[]): string {
  if (!articles.length) return '';

  const parts: string[] = ['=== REAL NEWS ARTICLES (via NewsAPI) ==='];
  for (const article of articles.slice(0, 8)) {
    const date = article.publishedAt?.split('T')[0] || 'Unknown';
    parts.push(`\n[${date}] "${article.title}"`);
    parts.push(`  Source: ${article.source?.name || 'Unknown'}`);
    if (article.description) {
      parts.push(`  Summary: ${article.description.substring(0, 250)}`);
    }
    parts.push(`  URL: ${article.url}`);
  }
  return parts.join('\n');
}
