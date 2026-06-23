// ============================================
// Agent State — LangGraph State Schema
// ============================================

import { Annotation } from '@langchain/langgraph';
import type {
  CompanyResearchOutput,
  FinancialAnalysisOutput,
  NewsIntelligenceOutput,
  MarketSentimentOutput,
  RiskAssessmentOutput,
  InvestmentRecommendation,
} from '@/lib/types';

export const ResearchGraphState = Annotation.Root({
  company: Annotation<string>({
    reducer: (_, val) => val,
    default: () => '',
  }),
  ticker: Annotation<string>({
    reducer: (_, val) => val,
    default: () => '',
  }),
  currentStep: Annotation<string>({
    reducer: (_, val) => val,
    default: () => '',
  }),
  companyResearch: Annotation<CompanyResearchOutput | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  financialAnalysis: Annotation<FinancialAnalysisOutput | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  newsIntelligence: Annotation<NewsIntelligenceOutput | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  marketSentiment: Annotation<MarketSentimentOutput | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  riskAssessment: Annotation<RiskAssessmentOutput | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  recommendation: Annotation<InvestmentRecommendation | null>({
    reducer: (_, val) => val,
    default: () => null,
  }),
  errors: Annotation<string[]>({
    reducer: (prev, val) => [...prev, ...val],
    default: () => [],
  }),
});

export type ResearchGraphStateType = typeof ResearchGraphState.State;
