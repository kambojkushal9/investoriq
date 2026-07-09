'use client';

// ============================================
// AI Investment Copilot — Proactive Insights
// ============================================

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Info } from 'lucide-react';

interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  description: string;
}

interface CopilotInsightsProps {
  researchState: any;
}

function generateInsights(rs: any): Insight[] {
  const insights: Insight[] = [];
  if (!rs) return insights;

  // Financial health insight
  if (rs.financialAnalysis) {
    const fa = rs.financialAnalysis;
    if (fa.healthScore >= 75) {
      insights.push({ type: 'bullish', title: 'Strong Financial Health', description: `Health score of ${fa.healthScore}/100 indicates robust fundamentals with solid profitability and cash flow.` });
    } else if (fa.healthScore < 45) {
      insights.push({ type: 'bearish', title: 'Weak Financial Health', description: `Health score of ${fa.healthScore}/100 suggests concerns around profitability, debt levels, or cash flow.` });
    }

    if (fa.growthScore >= 70) {
      insights.push({ type: 'bullish', title: 'High Growth Momentum', description: `Growth score of ${fa.growthScore}/100 signals strong revenue acceleration and market expansion.` });
    } else if (fa.growthScore < 40) {
      insights.push({ type: 'warning', title: 'Growth Slowing', description: `Growth score of ${fa.growthScore}/100 indicates decelerating growth — monitor closely.` });
    }
  }

  // Risk insight
  if (rs.riskAssessment) {
    if (rs.riskAssessment.overallRiskScore >= 65) {
      insights.push({ type: 'warning', title: 'Elevated Risk Level', description: `Overall risk score of ${rs.riskAssessment.overallRiskScore}/100 — higher than average. ${rs.riskAssessment.criticalRisks?.[0] || 'Multiple risk factors identified.'}` });
    } else if (rs.riskAssessment.overallRiskScore <= 35) {
      insights.push({ type: 'bullish', title: 'Low Risk Profile', description: `Risk score of ${rs.riskAssessment.overallRiskScore}/100 suggests a relatively safe investment with manageable risk factors.` });
    }
  }

  // Sentiment insight
  if (rs.marketSentiment) {
    if (rs.marketSentiment.sentimentScore >= 70) {
      insights.push({ type: 'bullish', title: 'Strong Market Sentiment', description: `Sentiment at ${rs.marketSentiment.sentimentScore}/100 — analysts and social media are bullish. Consensus: ${rs.marketSentiment.analystConsensus}.` });
    } else if (rs.marketSentiment.sentimentScore < 40) {
      insights.push({ type: 'bearish', title: 'Negative Market Sentiment', description: `Sentiment at ${rs.marketSentiment.sentimentScore}/100 — market participants are skeptical. ${rs.marketSentiment.analystConsensus}.` });
    }
  }

  // Recommendation confidence
  if (rs.recommendation) {
    const rec = rs.recommendation;
    if (rec.confidence >= 80) {
      insights.push({ type: 'neutral', title: 'High Conviction Call', description: `${rec.recommendation} recommendation with ${rec.confidence}% confidence — the AI committee has strong consensus.` });
    }
  }

  return insights.slice(0, 4);
}

const INSIGHT_STYLES = {
  bullish: { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  bearish: { icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  neutral: { icon: Info, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
};

export function CopilotInsights({ researchState }: CopilotInsightsProps) {
  const insights = generateInsights(researchState);

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Info className="w-8 h-8 text-zinc-700 mb-3" />
        <p className="text-sm text-zinc-500 font-medium">No insights yet</p>
        <p className="text-xs text-zinc-600 mt-1 max-w-[200px]">Research a company to get AI-generated proactive insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium mb-3">AI-Generated Insights</p>
      {insights.map((insight, i) => {
        const style = INSIGHT_STYLES[insight.type];
        const Icon = style.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-3 rounded-xl ${style.bg} border ${style.border}`}
          >
            <div className="flex items-start gap-2.5">
              <div className={`w-6 h-6 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon className={`w-3.5 h-3.5 ${style.color}`} />
              </div>
              <div>
                <h4 className={`text-xs font-semibold ${style.color} mb-0.5`}>{insight.title}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
