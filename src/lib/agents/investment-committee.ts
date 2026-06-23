// ============================================
// Agent 6: Investment Committee Agent
// ============================================

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PROMPTS } from '@/config/constants';
import type { ResearchGraphStateType } from './state';
import type { InvestmentRecommendation } from '@/lib/types';
import { invokeWithRetry } from './utils';

function parseJSON<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

export async function investmentCommitteeAgent(
  state: ResearchGraphStateType
): Promise<Partial<ResearchGraphStateType>> {
  try {
    await new Promise(r => setTimeout(r, 2000));
    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.3,
      maxRetries: 0,
    });

    const companyName = state.companyResearch?.name || state.company;

    // Compile all findings
    const briefing = [];

    if (state.companyResearch) {
      briefing.push('=== COMPANY RESEARCH ===');
      briefing.push(`Name: ${state.companyResearch.name}`);
      briefing.push(`Sector: ${state.companyResearch.sector} | Industry: ${state.companyResearch.industry}`);
      briefing.push(`Business Model: ${state.companyResearch.businessModel}`);
      briefing.push(`Competitive Advantage: ${state.companyResearch.competitiveAdvantage}`);
      briefing.push(`Key Products: ${state.companyResearch.products?.join(', ')}`);
    }

    if (state.financialAnalysis) {
      briefing.push('\n=== FINANCIAL ANALYSIS ===');
      briefing.push(`Health Score: ${state.financialAnalysis.healthScore}/100`);
      briefing.push(`Growth Score: ${state.financialAnalysis.growthScore}/100`);
      briefing.push(`Market Cap: $${(state.financialAnalysis.metrics.marketCap / 1e9).toFixed(1)}B`);
      briefing.push(`P/E Ratio: ${state.financialAnalysis.metrics.peRatio || 'N/A'}`);
      briefing.push(`EPS: $${state.financialAnalysis.metrics.eps || 'N/A'}`);
      briefing.push(`Valuation: ${state.financialAnalysis.valuationAssessment}`);
      briefing.push(`Strengths: ${state.financialAnalysis.strengths?.join('; ')}`);
      briefing.push(`Weaknesses: ${state.financialAnalysis.weaknesses?.join('; ')}`);
    }

    if (state.newsIntelligence) {
      briefing.push('\n=== NEWS INTELLIGENCE ===');
      briefing.push(`Overall Sentiment: ${state.newsIntelligence.overallSentiment}`);
      briefing.push(`Key Themes: ${state.newsIntelligence.themes?.join(', ')}`);
      briefing.push(`Key Developments: ${state.newsIntelligence.keyDevelopments?.join('; ')}`);
      briefing.push(`Analysis: ${state.newsIntelligence.analysis}`);
    }

    if (state.marketSentiment) {
      briefing.push('\n=== MARKET SENTIMENT ===');
      briefing.push(`Sentiment Score: ${state.marketSentiment.sentimentScore}/100`);
      briefing.push(`Analyst Consensus: ${state.marketSentiment.analystConsensus}`);
      briefing.push(`Social Buzz: ${state.marketSentiment.socialBuzz}`);
      briefing.push(`Analysis: ${state.marketSentiment.analysis}`);
    }

    if (state.riskAssessment) {
      briefing.push('\n=== RISK ASSESSMENT ===');
      briefing.push(`Overall Risk Score: ${state.riskAssessment.overallRiskScore}/100 (higher = riskier)`);
      for (const cat of state.riskAssessment.categories) {
        briefing.push(`  ${cat.name}: ${cat.score}/100 - ${cat.factors?.join(', ')}`);
      }
      briefing.push(`Critical Risks: ${state.riskAssessment.criticalRisks?.join('; ')}`);
      briefing.push(`Mitigating Factors: ${state.riskAssessment.mitigatingFactors?.join('; ')}`);
    }

    const response = await invokeWithRetry(model, [
      ['system', PROMPTS.INVESTMENT_COMMITTEE],
      ['human', `As the Investment Committee, review all analyst findings for ${companyName} and produce your final investment recommendation.\n\n${briefing.join('\n')}`],
    ]);

    const content = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

    const data = parseJSON<InvestmentRecommendation>(content);

    return {
      recommendation: data,
      currentStep: 'investment_committee_complete',
    };
  } catch (error) {
    console.error('Investment Committee Agent error:', error);
    return {
      errors: [`Investment Committee failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
      currentStep: 'investment_committee_error',
    };
  }
}
