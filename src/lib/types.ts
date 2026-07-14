// ============================================
// INVESTORIQ — Global Type Definitions
// ============================================

export type Recommendation = 'INVEST' | 'HOLD' | 'PASS';

// ---- Agent Outputs ----

export interface CompanyResearchOutput {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  description: string;
  founded: string;
  headquarters: string;
  ceo: string;
  employees: string;
  businessModel: string;
  products: string[];
  competitiveAdvantage: string;
  competitors: string[];
}

export interface FinancialMetrics {
  marketCap: number;
  currentPrice: number;
  peRatio: number | null;
  eps: number | null;
  revenueGrowth: number | null;
  profitMargin: number | null;
  debtToEquity: number | null;
  freeCashFlow: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  beta: number | null;
}

export interface FinancialAnalysisOutput {
  metrics: FinancialMetrics;
  healthScore: number; // 0-100
  growthScore: number; // 0-100
  valuationAssessment: string;
  strengths: string[];
  weaknesses: string[];
  analysis: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  date: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url?: string;
}

export interface NewsIntelligenceOutput {
  articles: NewsItem[];
  themes: string[];
  overallSentiment: string;
  keyDevelopments: string[];
  analysis: string;
}

export interface MarketSentimentOutput {
  sentimentScore: number; // 0-100
  socialBuzz: string;
  redditSentiment: string;
  twitterSentiment: string;
  analystConsensus: string;
  keyOpinions: string[];
  analysis: string;
}

export interface RiskCategory {
  name: string;
  score: number; // 0-100 (higher = more risky)
  factors: string[];
}

export interface RiskAssessmentOutput {
  overallRiskScore: number; // 0-100
  categories: RiskCategory[];
  criticalRisks: string[];
  mitigatingFactors: string[];
  analysis: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DebatePoint {
  argument: string;
  evidence: string;
}

export interface InvestmentRecommendation {
  recommendation: Recommendation;
  confidence: number; // 0-100
  investmentThesis: string;
  bullCase: DebatePoint[];
  bearCase: DebatePoint[];
  swot: SWOTAnalysis;
  priceTarget: string;
  timeHorizon: string;
  scores: InvestmentScores;
}

export interface InvestmentScores {
  financialHealth: number;
  growthPotential: number;
  competitiveMoat: number;
  marketSentiment: number;
  riskProfile: number; // Inverted: 100 = low risk
}

// ---- Agent State ----

export interface ResearchState {
  company: string;
  ticker: string;
  currentStep: string;
  companyResearch: CompanyResearchOutput | null;
  financialAnalysis: FinancialAnalysisOutput | null;
  newsIntelligence: NewsIntelligenceOutput | null;
  marketSentiment: MarketSentimentOutput | null;
  riskAssessment: RiskAssessmentOutput | null;
  recommendation: InvestmentRecommendation | null;
  errors: string[];
}

// ---- SSE Events ----

export interface ResearchEvent {
  type: 'step_start' | 'step_complete' | 'step_error' | 'complete';
  step: string;
  data?: unknown;
  error?: string;
  timestamp: number;
}

// ---- Research Steps ----

export const RESEARCH_STEPS = [
  { id: 'company_research', label: 'Researching Company', icon: 'Building2' },
  { id: 'financial_analysis', label: 'Analyzing Financials', icon: 'TrendingUp' },
  { id: 'news_intelligence', label: 'Checking News', icon: 'Newspaper' },
  { id: 'market_sentiment', label: 'Evaluating Sentiment', icon: 'MessageSquare' },
  { id: 'risk_assessment', label: 'Assessing Risks', icon: 'ShieldAlert' },
  { id: 'investment_committee', label: 'Generating Recommendation', icon: 'Award' },
] as const;

// ---- Database Types ----

export interface ResearchReport {
  id: string;
  company: string;
  ticker: string;
  recommendation: Recommendation;
  confidence: number;
  fullReport: ResearchState;
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  company: string;
  ticker: string;
  addedAt: string;
}

// ---- Comparison ----

export interface ComparisonResult {
  companyA: ResearchState;
  companyB: ResearchState;
  winner: string;
  reasoning: string;
  comparison: {
    category: string;
    companyAScore: number;
    companyBScore: number;
  }[];
}

// ---- Market Data (Trading Chart) ----

export type MarketRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'MAX';
export type ChartMode = 'area' | 'line' | 'candlestick';

export const MARKET_RANGES: MarketRange[] = ['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

export interface OHLCVPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface HistoricalMarketData {
  ticker: string;
  currency: string;
  range: MarketRange;
  interval: string;
  currentPrice: number;
  previousClose: number;
  companyName: string;
  data: OHLCVPoint[];
}

export interface ChartSummary {
  startPrice: number;
  endPrice: number;
  percentageReturn: number;
  highestPrice: number;
  lowestPrice: number;
  averageVolume: number;
  largestUpMove: number;
  largestDownMove: number;
  recentTrend: 'bullish' | 'bearish' | 'neutral';
  volatilityProxy: number; // standard deviation of daily returns
  totalDataPoints: number;
}

export type AnomalyType = 'volume_spike' | 'large_move' | 'range_high' | 'range_low' | 'momentum_shift';

export interface ChartAnomalyMarker {
  index: number;
  timestamp: number;
  type: AnomalyType;
  label: string;
  description: string;
  magnitude: number; // how significant (0-1)
}
