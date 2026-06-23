import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PROMPTS } from '@/config/constants';
import type { ResearchGraphStateType } from './state';
import { searchCompanyInfo, searchCompanySentiment, searchCompanyRisks } from '@/lib/data/tavily';
import { getCompanyOverview, getEarningsData, buildAlphaVantageContext } from '@/lib/data/alpha-vantage';
import { getCompanyProfile, getCompanyPeers, getBasicFinancials, buildFinnhubFinancialsContext, getCompanyNews, buildFinnhubNewsContext, getRecommendationTrends, buildRecommendationsContext } from '@/lib/data/finnhub';
import { getQuote, getDetailedFinancials } from '@/lib/data/yahoo-finance';
import { searchNews, buildNewsContext } from '@/lib/data/news-api';
import { invokeWithRetry } from './utils';

function parseJSON<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

export async function companyResearchAgent(
  state: ResearchGraphStateType
): Promise<Partial<ResearchGraphStateType>> {
  try {
    await new Promise(r => setTimeout(r, 2000));
    const ticker = state.ticker || '';

    // We do ALL data fetching here to minimize API calls and pass them all into ONE mega prompt
    // Use Promise.allSettled to not fail if one provider is down or rate limited
    const results = await Promise.allSettled([
      searchCompanyInfo(state.company, ticker), // 0
      ticker ? getCompanyOverview(ticker) : Promise.resolve(null), // 1
      ticker ? getCompanyProfile(ticker) : Promise.resolve(null), // 2
      ticker ? getCompanyPeers(ticker) : Promise.resolve([]), // 3
      ticker ? getQuote(ticker) : Promise.resolve(null), // 4
      ticker ? getDetailedFinancials(ticker) : Promise.resolve({}), // 5
      ticker ? getEarningsData(ticker) : Promise.resolve(null), // 6
      ticker ? getBasicFinancials(ticker) : Promise.resolve(null), // 7
      ticker ? getCompanyNews(ticker) : Promise.resolve([]), // 8
      searchNews(`${state.company} ${ticker}`.trim()), // 9
      ticker ? getRecommendationTrends(ticker) : Promise.resolve([]), // 10
      searchCompanySentiment(state.company, ticker), // 11
      searchCompanyRisks(state.company, ticker), // 12
    ]);

    const val = (index: number) => results[index].status === 'fulfilled' ? (results[index] as PromiseFulfilledResult<any>).value : null;

    const webResearch = val(0);
    const alphaOverview = val(1);
    const finnhubProfile = val(2);
    const peers = val(3) || [];
    const quote = val(4);
    const detailed = val(5) || {};
    const alphaEarnings = val(6);
    const finnhubFinancials = val(7);
    const finnhubNews = val(8) || [];
    const newsApiArticles = val(9) || [];
    const finnhubTrends = val(10) || [];
    const webSentiment = val(11);
    const riskIntel = val(12);

    // Merge financial metrics
    const metrics = {
      ...(quote || {}),
      ...(detailed || {})
    };

    const contextParts: string[] = [];

    // Company Context
    if (alphaOverview) contextParts.push(`Name: ${alphaOverview.Name}\nSector: ${alphaOverview.Sector}\nDescription: ${alphaOverview.Description}`);
    if (finnhubProfile) contextParts.push(`Industry: ${finnhubProfile.finnhubIndustry}\nMarket Cap: $${(finnhubProfile.marketCapitalization * 1e6).toLocaleString()}`);
    if (peers.length > 0) contextParts.push(`Competitor Tickers: ${peers.join(', ')}`);
    if (webResearch) contextParts.push(`Web Research: ${webResearch}`);

    // Financial Context
    contextParts.push(`\n=== FINANCIAL METRICS ===\n${JSON.stringify(metrics, null, 2)}`);
    if (alphaOverview || alphaEarnings) contextParts.push(buildAlphaVantageContext(alphaOverview, alphaEarnings));
    if (finnhubFinancials) contextParts.push(buildFinnhubFinancialsContext(finnhubFinancials));

    // News Context
    contextParts.push(`\n=== NEWS ===`);
    if (newsApiArticles.length > 0) contextParts.push(buildNewsContext(newsApiArticles));
    if (finnhubNews.length > 0) contextParts.push(buildFinnhubNewsContext(finnhubNews));

    // Sentiment Context
    contextParts.push(`\n=== SENTIMENT ===`);
    if (finnhubTrends.length > 0) contextParts.push(buildRecommendationsContext(finnhubTrends));
    if (webSentiment) contextParts.push(webSentiment);

    // Risk Context
    contextParts.push(`\n=== RISKS ===`);
    if (riskIntel) contextParts.push(riskIntel);

    const enrichedContext = contextParts.join('\n');

    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.3,
      maxRetries: 0,
    });

    // 1 Massive LLM Call instead of 5
    const response = await invokeWithRetry(model, [
      ['system', PROMPTS.DATA_INTELLIGENCE],
      ['human', `Research this company: ${state.company} (${ticker || 'unknown'}).\n\nHere is ALL gathered data:\n\n${enrichedContext}`],
    ]);

    const content = typeof response.content === 'string' ? response.content : JSON.stringify(response.content);
    const data = parseJSON<any>(content);

    // Inject the raw metrics into financialAnalysis so downstream agents and UI don't crash
    if (data.financialAnalysis) {
      data.financialAnalysis.metrics = {
        marketCap: metrics.marketCap || 0,
        currentPrice: metrics.currentPrice || 0,
        peRatio: metrics.peRatio || null,
        eps: metrics.eps || null,
        revenueGrowth: metrics.revenueGrowth || null,
        profitMargin: metrics.profitMargin || null,
        debtToEquity: metrics.debtToEquity || null,
        freeCashFlow: metrics.freeCashFlow || null,
        dividendYield: metrics.dividendYield || null,
        fiftyTwoWeekHigh: metrics.fiftyTwoWeekHigh || null,
        fiftyTwoWeekLow: metrics.fiftyTwoWeekLow || null,
        beta: metrics.beta || null,
      };
    }

    return {
      ticker: data.companyResearch?.ticker || state.ticker,
      companyResearch: data.companyResearch,
      financialAnalysis: data.financialAnalysis,
      newsIntelligence: data.newsIntelligence,
      marketSentiment: data.marketSentiment,
      riskAssessment: data.riskAssessment,
      currentStep: 'company_research_complete', // this satisfies the UI for step 1
    };
  } catch (error) {
    console.error('Company Research Agent error:', error);
    return {
      errors: [`Data Intelligence failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      currentStep: 'company_research_error',
    };
  }
}
