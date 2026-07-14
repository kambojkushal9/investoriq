'use client';

import { GlassCard } from '@/components/shared/glass-card';
import type { ChartSummary, InvestmentRecommendation, FinancialAnalysisOutput } from '@/lib/types';
import { Scale, TrendingUp, TrendingDown, ShieldAlert, BadgeCheck } from 'lucide-react';
import { getRecommendationClass } from '@/lib/utils';

interface MarketFundamentalsInsightProps {
  summary: ChartSummary;
  recommendation?: InvestmentRecommendation | null;
  riskScore?: number | null;
  financialAnalysis?: FinancialAnalysisOutput | null;
}

export function MarketFundamentalsInsight({ 
  summary, 
  recommendation, 
  riskScore,
  financialAnalysis
}: MarketFundamentalsInsightProps) {
  
  // Create a synthesized insight connecting price action to fundamentals
  const getSynthesis = () => {
    if (!recommendation) return "Awaiting full fundamental analysis to compare with market price action.";

    const isPriceUp = summary.percentageReturn > 0;
    const isBullish = recommendation.recommendation === 'INVEST';
    const isBearish = recommendation.recommendation === 'PASS';
    
    if (isBullish && isPriceUp) {
      return "Market price reflects the strong underlying fundamentals and AI thesis.";
    } else if (isBullish && !isPriceUp) {
      return "Potential opportunity: Price is lagging behind strong fundamental AI recommendation.";
    } else if (isBearish && isPriceUp) {
      return "Caution: Market exuberance contrasts with weak underlying fundamentals and AI warnings.";
    } else if (isBearish && !isPriceUp) {
      return "Market price is correctly pricing in the weak fundamentals identified by AI.";
    }
    
    return "Mixed signals between market momentum and underlying fundamental valuation.";
  };

  return (
    <GlassCard className="p-5 h-full flex flex-col" tilt>
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <Scale className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-semibold text-zinc-300 font-[family-name:var(--font-outfit)]">Market vs Fundamentals</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <p className="text-sm text-zinc-300 leading-relaxed font-medium mb-6 text-center italic px-2">
          "{getSynthesis()}"
        </p>

        <div className="space-y-3">
          {recommendation && (
            <div className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5 text-indigo-400"/> AI Rec</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${getRecommendationClass(recommendation.recommendation)}`}>
                {recommendation.recommendation}
              </span>
            </div>
          )}
          
          <div className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
            <span className="text-xs text-zinc-400 flex items-center gap-1.5">
              {summary.percentageReturn >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400"/> : <TrendingDown className="w-3.5 h-3.5 text-rose-400"/>} 
              Price Trend
            </span>
            <span className={`text-xs font-mono font-medium ${summary.percentageReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {summary.percentageReturn >= 0 ? '+' : ''}{summary.percentageReturn.toFixed(1)}%
            </span>
          </div>

          {riskScore != null && (
            <div className="flex justify-between items-center bg-white/5 px-3 py-2.5 rounded-lg border border-white/5">
              <span className="text-xs text-zinc-400 flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-amber-400"/> Risk Score</span>
              <span className="text-xs font-mono font-medium text-zinc-200">{riskScore}/100</span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
