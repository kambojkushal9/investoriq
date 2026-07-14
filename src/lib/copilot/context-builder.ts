// ============================================
// AI Investment Copilot — Context Builder
// ============================================
// Assembles the full application context into a
// structured prompt for the Gemini LLM.

import type { CopilotContext } from './types';
import { formatCurrency } from '@/lib/utils';
import { formatChartContextForAI } from '@/lib/chart-analytics';

export function buildContextPrompt(context: CopilotContext): string {
  const parts: string[] = [];

  parts.push(`=== USER CONTEXT ===`);
  parts.push(`Current Page: ${context.currentPage}`);

  if (context.activeCompany) {
    parts.push(`Active Company: ${context.activeCompany}`);
  }
  if (context.activeTicker) {
    parts.push(`Active Ticker: ${context.activeTicker}`);
  }

  const rs = context.researchState;
  const cd = context.compareData;
  if (!rs && !cd && !context.chartContext) {
    parts.push(`\nNo research report, chart, or comparison is currently loaded. The user may be on the landing page or hasn't searched yet.`);
    return parts.join('\n');
  }

  if (cd) {
    parts.push(`\n=== COMPARE DATA ===`);
    parts.push(`User is currently comparing two companies: ${cd.companyA} vs ${cd.companyB}`);
    
    // Add brief summary of Company A
    parts.push(`\n--- ${cd.companyA} ---`);
    if (cd.resultA.recommendation) {
      parts.push(`Recommendation: ${cd.resultA.recommendation.recommendation}`);
      if (cd.resultA.recommendation.scores) {
        parts.push(`Financial Health: ${cd.resultA.recommendation.scores.financialHealth}/100`);
        parts.push(`Growth Potential: ${cd.resultA.recommendation.scores.growthPotential}/100`);
      }
    }
    
    // Add brief summary of Company B
    parts.push(`\n--- ${cd.companyB} ---`);
    if (cd.resultB.recommendation) {
      parts.push(`Recommendation: ${cd.resultB.recommendation.recommendation}`);
      if (cd.resultB.recommendation.scores) {
        parts.push(`Financial Health: ${cd.resultB.recommendation.scores.financialHealth}/100`);
        parts.push(`Growth Potential: ${cd.resultB.recommendation.scores.growthPotential}/100`);
      }
    }
    
    parts.push(`\n(Please focus on providing a comparative analysis of the strengths and weaknesses of both companies based on the above metrics.)`);
    return parts.join('\n');
  }

  // Company Research
  if (rs?.companyResearch) {
    const cr = rs.companyResearch;
    parts.push(`\n=== COMPANY RESEARCH ===`);
    parts.push(`Name: ${cr.name}`);
    parts.push(`Ticker: ${cr.ticker}`);
    parts.push(`Sector: ${cr.sector} | Industry: ${cr.industry}`);
    parts.push(`CEO: ${cr.ceo} | Founded: ${cr.founded} | HQ: ${cr.headquarters}`);
    parts.push(`Employees: ${cr.employees}`);
    parts.push(`Business Model: ${cr.businessModel}`);
    parts.push(`Competitive Advantage: ${cr.competitiveAdvantage}`);
    if (cr.products?.length) parts.push(`Products: ${cr.products.join(', ')}`);
    if (cr.competitors?.length) parts.push(`Competitors: ${cr.competitors.join(', ')}`);
  }

  // Financial Analysis
  if (rs?.financialAnalysis) {
    const fa = rs.financialAnalysis;
    parts.push(`\n=== FINANCIAL ANALYSIS ===`);
    parts.push(`Health Score: ${fa.healthScore}/100`);
    parts.push(`Growth Score: ${fa.growthScore}/100`);
    parts.push(`Valuation: ${fa.valuationAssessment}`);
    parts.push(`Analysis: ${fa.analysis}`);
    if (fa.strengths?.length) parts.push(`Strengths: ${fa.strengths.join('; ')}`);
    if (fa.weaknesses?.length) parts.push(`Weaknesses: ${fa.weaknesses.join('; ')}`);

    const m = fa.metrics;
    parts.push(`\n--- Financial Metrics ---`);
    parts.push(`Market Cap: ${formatCurrency(m.marketCap)}`);
    parts.push(`Current Price: $${m.currentPrice?.toFixed(2) || 'N/A'}`);
    parts.push(`P/E Ratio: ${m.peRatio?.toFixed(1) || 'N/A'}`);
    parts.push(`EPS: $${m.eps?.toFixed(2) || 'N/A'}`);
    parts.push(`52W High: $${m.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}`);
    parts.push(`52W Low: $${m.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}`);
    if (m.revenueGrowth != null) parts.push(`Revenue Growth: ${(m.revenueGrowth * 100).toFixed(1)}%`);
    if (m.profitMargin != null) parts.push(`Profit Margin: ${(m.profitMargin * 100).toFixed(1)}%`);
    if (m.debtToEquity != null) parts.push(`Debt/Equity: ${m.debtToEquity.toFixed(2)}`);
    if (m.beta != null) parts.push(`Beta: ${m.beta.toFixed(2)}`);
  }

  // News Intelligence
  if (rs?.newsIntelligence) {
    const ni = rs.newsIntelligence;
    parts.push(`\n=== NEWS INTELLIGENCE ===`);
    parts.push(`Overall Sentiment: ${ni.overallSentiment}`);
    parts.push(`Analysis: ${ni.analysis}`);
    if (ni.themes?.length) parts.push(`Themes: ${ni.themes.join(', ')}`);
    if (ni.keyDevelopments?.length) parts.push(`Key Developments: ${ni.keyDevelopments.join('; ')}`);
    if (ni.articles?.length) {
      parts.push(`Recent Headlines:`);
      ni.articles.slice(0, 5).forEach(a => {
        parts.push(`  [${a.sentiment.toUpperCase()}] ${a.title} (${a.source}, ${a.date})`);
      });
    }
  }

  // Market Sentiment
  if (rs.marketSentiment) {
    const ms = rs.marketSentiment;
    parts.push(`\n=== MARKET SENTIMENT ===`);
    parts.push(`Sentiment Score: ${ms.sentimentScore}/100`);
    parts.push(`Analyst Consensus: ${ms.analystConsensus}`);
    parts.push(`Social Buzz: ${ms.socialBuzz}`);
    parts.push(`Reddit: ${ms.redditSentiment}`);
    parts.push(`Twitter/X: ${ms.twitterSentiment}`);
    parts.push(`Analysis: ${ms.analysis}`);
  }

  // Risk Assessment
  if (rs?.riskAssessment) {
    const ra = rs.riskAssessment;
    parts.push(`\n=== RISK ASSESSMENT ===`);
    parts.push(`Overall Risk Score: ${ra.overallRiskScore}/100 (higher = riskier)`);
    parts.push(`Analysis: ${ra.analysis}`);
    if (ra.categories?.length) {
      ra.categories.forEach(c => {
        parts.push(`  ${c.name}: ${c.score}/100 — ${c.factors?.join(', ')}`);
      });
    }
    if (ra.criticalRisks?.length) parts.push(`Critical Risks: ${ra.criticalRisks.join('; ')}`);
    if (ra.mitigatingFactors?.length) parts.push(`Mitigating Factors: ${ra.mitigatingFactors.join('; ')}`);
  }

  // Investment Recommendation
  if (rs?.recommendation) {
    const rec = rs.recommendation;
    parts.push(`\n=== INVESTMENT RECOMMENDATION ===`);
    parts.push(`Recommendation: ${rec.recommendation}`);
    parts.push(`Confidence: ${rec.confidence}%`);
    parts.push(`Investment Thesis: ${rec.investmentThesis}`);
    parts.push(`Price Target: ${rec.priceTarget}`);
    parts.push(`Time Horizon: ${rec.timeHorizon}`);

    if (rec.scores) {
      parts.push(`\n--- Investment Scores ---`);
      parts.push(`Financial Health: ${rec.scores.financialHealth}/100`);
      parts.push(`Growth Potential: ${rec.scores.growthPotential}/100`);
      parts.push(`Competitive Moat: ${rec.scores.competitiveMoat}/100`);
      parts.push(`Market Sentiment: ${rec.scores.marketSentiment}/100`);
      parts.push(`Risk Profile: ${rec.scores.riskProfile}/100 (100 = low risk)`);
    }

    if (rec.bullCase?.length) {
      parts.push(`\nBull Case:`);
      rec.bullCase.forEach(b => parts.push(`  + ${b.argument}: ${b.evidence}`));
    }
    if (rec.bearCase?.length) {
      parts.push(`\nBear Case:`);
      rec.bearCase.forEach(b => parts.push(`  - ${b.argument}: ${b.evidence}`));
    }

    if (rec.swot) {
      parts.push(`\nSWOT:`);
      parts.push(`  Strengths: ${rec.swot.strengths?.join('; ')}`);
      parts.push(`  Weaknesses: ${rec.swot.weaknesses?.join('; ')}`);
      parts.push(`  Opportunities: ${rec.swot.opportunities?.join('; ')}`);
      parts.push(`  Threats: ${rec.swot.threats?.join('; ')}`);
    }
  }

  // Trading Chart Context
  if (context.chartContext) {
    parts.push('\n' + formatChartContextForAI(
      context.chartContext.ticker,
      context.chartContext.chartRange,
      context.chartContext.chartMode,
      context.chartContext.summary,
      context.chartContext.selectedPoint,
      context.chartContext.anomalies
    ));
  }

  return parts.join('\n');
}
