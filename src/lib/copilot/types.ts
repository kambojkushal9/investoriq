// ============================================
// AI Investment Copilot — Type Definitions
// ============================================

import type { ResearchState } from '@/lib/types';

export type ExplainMode =
  | 'default'
  | 'eli10'
  | 'eli18'
  | 'beginner'
  | 'mba'
  | 'cfa'
  | 'quick';

export const EXPLAIN_MODE_LABELS: Record<ExplainMode, string> = {
  default: 'Standard',
  eli10: 'Explain Like I\'m 10',
  eli18: 'Explain Like I\'m 18',
  beginner: 'Beginner Investor',
  mba: 'MBA Student',
  cfa: 'CFA Analyst',
  quick: 'In 30 Seconds',
};

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
  isStreaming?: boolean;
}

export interface CopilotContext {
  currentPage: string;
  activeCompany: string | null;
  activeTicker: string | null;
  researchState: ResearchState | null;
  explainMode: ExplainMode;
  compareData?: {
    companyA: string;
    companyB: string;
    resultA: ResearchState;
    resultB: ResearchState;
  };
  chartContext?: {
    company: string;
    ticker: string;
    chartRange: string;
    chartMode: string;
    summary: any;
    selectedPoint?: any;
    anomalies?: any[];
  };
}

export interface CopilotChatRequest {
  message: string;
  context: CopilotContext;
  history: { role: 'user' | 'assistant'; content: string }[];
  explainScreen?: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  requiresResearch: boolean;
}

export const QUICK_ACTIONS: QuickAction[] = [
  { id: 'swot', label: 'Generate SWOT', icon: 'Grid3x3', prompt: 'Generate a detailed SWOT analysis for the current company.', requiresResearch: true },
  { id: 'dcf', label: 'Show DCF', icon: 'Calculator', prompt: 'Walk me through a simplified DCF valuation for this company.', requiresResearch: true },
  { id: 'compare', label: 'Compare Competitors', icon: 'GitCompare', prompt: 'Compare this company with its top 3 competitors across key metrics.', requiresResearch: true },
  { id: 'risks', label: 'Explain Risks', icon: 'ShieldAlert', prompt: 'What are the biggest risks of investing in this company right now?', requiresResearch: true },
  { id: 'forecast', label: 'Future Forecast', icon: 'TrendingUp', prompt: 'What is the growth outlook for this company over the next 2-3 years?', requiresResearch: true },
  { id: 'pe', label: 'Explain P/E Ratio', icon: 'BarChart3', prompt: 'Explain this company\'s P/E ratio — is it overvalued or undervalued and why?', requiresResearch: true },
  { id: 'earnings', label: 'Earnings Analysis', icon: 'LineChart', prompt: 'Analyze the recent earnings performance and what it signals for the future.', requiresResearch: true },
  { id: 'story', label: 'Investment Story', icon: 'BookOpen', prompt: 'Tell the investment story of this company as if explaining it to someone at a dinner party. Make it engaging and relatable.', requiresResearch: true },
  { id: 'chart_pattern', label: 'Analyze Chart Pattern', icon: 'TrendingUp', prompt: 'Analyze the current chart pattern and momentum. What does the price action suggest?', requiresResearch: true },
  { id: 'chart_fundamentals', label: 'Chart vs Fundamentals', icon: 'Scale', prompt: 'How does the recent market price action compare to the underlying fundamental valuation?', requiresResearch: true },
];
