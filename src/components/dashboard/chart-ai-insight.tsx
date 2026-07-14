'use client';

import { GlassCard } from '@/components/shared/glass-card';
import type { ChartSummary, ChartAnomalyMarker } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, ArrowRight, Bot, Activity } from 'lucide-react';
import { useCopilot } from '@/components/copilot/copilot-provider';

interface ChartAiInsightProps {
  summary: ChartSummary;
  anomalies?: ChartAnomalyMarker[];
}

export function ChartAiInsight({ summary, anomalies = [] }: ChartAiInsightProps) {
  const { setIsOpen, sendMessage } = useCopilot();

  const getTrendIcon = () => {
    switch (summary.recentTrend) {
      case 'bullish': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'bearish': return <TrendingDown className="w-5 h-5 text-rose-400" />;
      default: return <Minus className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getVolatilityLabel = () => {
    if (summary.volatilityProxy > 3) return 'High';
    if (summary.volatilityProxy > 1.5) return 'Moderate';
    return 'Low';
  };

  // Generate a basic deterministic observation based on stats
  const generateObservation = () => {
    let obs = `Over the selected period, the price ${summary.percentageReturn >= 0 ? 'gained' : 'lost'} ${Math.abs(summary.percentageReturn).toFixed(1)}%. `;
    
    if (summary.recentTrend === 'bullish') {
      obs += "Recent momentum is positive, ";
    } else if (summary.recentTrend === 'bearish') {
      obs += "Recent momentum is negative, ";
    } else {
      obs += "Recent price action is relatively flat, ";
    }

    if (summary.volatilityProxy > 3) {
      obs += "with high volatility indicating significant market uncertainty.";
    } else if (summary.volatilityProxy < 1.5) {
      obs += "with low volatility suggesting stable market sentiment.";
    } else {
      obs += "with moderate volatility.";
    }

    if (anomalies && anomalies.length > 0) {
      const spikes = anomalies.filter(a => a.type === 'volume_spike').length;
      if (spikes > 0) {
        obs += ` We've detected ${spikes} unusual volume spike${spikes > 1 ? 's' : ''} that may warrant investigation.`;
      }
    }

    return obs;
  };

  return (
    <GlassCard className="p-5 h-full flex flex-col" tilt>
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
        <Bot className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-semibold text-zinc-300 font-[family-name:var(--font-outfit)]">AI Chart Intelligence</h3>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Trend</p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200 capitalize">
            {getTrendIcon()} {summary.recentTrend}
          </div>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Volatility</p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
            <Activity className="w-4 h-4 text-amber-400" /> {getVolatilityLabel()}
          </div>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Anomalies</p>
          <div className="flex items-center gap-1.5 text-sm font-medium text-zinc-200">
            {anomalies.length > 0 ? (
              <><AlertTriangle className="w-4 h-4 text-rose-400" /> {anomalies.length} found</>
            ) : (
              <><Zap className="w-4 h-4 text-zinc-500" /> None</>
            )}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 mb-5 flex-1">
        <p className="text-sm text-zinc-400 leading-relaxed">
          "{generateObservation()}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        <button 
          onClick={() => { setIsOpen(true); sendMessage("Explain the current chart pattern and momentum in detail."); }}
          className="px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors border border-white/5"
        >
          Analyze Momentum
        </button>
        <button 
          onClick={() => { setIsOpen(true); sendMessage("What are the key technical support and resistance levels visible on this chart?"); }}
          className="px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-lg text-zinc-300 transition-colors border border-white/5"
        >
          Key Levels
        </button>
      </div>
    </GlassCard>
  );
}
