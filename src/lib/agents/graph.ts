// ============================================
// LangGraph Workflow — Multi-Agent Pipeline
// ============================================

import { StateGraph } from '@langchain/langgraph';
import { ResearchGraphState } from './state';
import { companyResearchAgent } from './company-research';
import { financialAnalystAgent } from './financial-analyst';
import { newsIntelligenceAgent } from './news-intelligence';
import { marketSentimentAgent } from './market-sentiment';
import { riskAssessmentAgent } from './risk-assessment';
import { investmentCommitteeAgent } from './investment-committee';

export function createResearchGraph() {
  const graph = new StateGraph(ResearchGraphState)
    .addNode('company_research', companyResearchAgent)
    .addNode('financial_analysis', financialAnalystAgent)
    .addNode('news_intelligence', newsIntelligenceAgent)
    .addNode('market_sentiment', marketSentimentAgent)
    .addNode('risk_assessment', riskAssessmentAgent)
    .addNode('investment_committee', investmentCommitteeAgent)
    .addEdge('__start__', 'company_research')
    .addEdge('company_research', 'financial_analysis')
    .addEdge('financial_analysis', 'news_intelligence')
    .addEdge('news_intelligence', 'market_sentiment')
    .addEdge('market_sentiment', 'risk_assessment')
    .addEdge('risk_assessment', 'investment_committee')
    .addEdge('investment_committee', '__end__');

  return graph.compile();
}

export type ResearchGraph = ReturnType<typeof createResearchGraph>;
