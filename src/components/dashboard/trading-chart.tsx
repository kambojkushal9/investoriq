'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Activity, Loader2, Maximize2, 
  BarChart2, LineChart, CandlestickChart, Eye, EyeOff, Bot, HelpCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, 
  CartesianGrid, ComposedChart, Bar, Cell, Line
} from 'recharts';
import { GlassCard } from '@/components/shared/glass-card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { useMarketData } from '@/hooks/use-market-data';
import { useCopilot } from '@/components/copilot/copilot-provider';
import type { MarketRange, ChartMode, OHLCVPoint, InvestmentRecommendation, FinancialAnalysisOutput } from '@/lib/types';
import { MARKET_RANGES } from '@/lib/types';
import { ChartAiInsight } from './chart-ai-insight';
import { MarketFundamentalsInsight } from './market-fundamentals-insight';
import { formatChartContextForAI } from '@/lib/chart-analytics';

interface TradingChartProps {
  ticker: string;
  companyName: string;
  recommendation?: InvestmentRecommendation | null;
  riskScore?: number | null;
  financialAnalysis?: FinancialAnalysisOutput | null;
}

export function TradingChart({ 
  ticker, 
  companyName,
  recommendation,
  riskScore,
  financialAnalysis 
}: TradingChartProps) {
  const { range, setRange, data, isLoading, error } = useMarketData(ticker);
  const [mode, setMode] = useState<ChartMode>('area');
  const [showVolume, setShowVolume] = useState(true);
  const { setChartContext, setIsOpen, sendMessage } = useCopilot();

  // Sync chart context to copilot
  useEffect(() => {
    if (data?.summary) {
      setChartContext({
        company: companyName,
        ticker,
        chartRange: range,
        chartMode: mode,
        summary: data.summary,
        anomalies: data.anomalies
      });
    } else {
      setChartContext(undefined);
    }
  }, [data, range, mode, companyName, ticker, setChartContext]);

  const isUp = data ? (data.summary?.percentageReturn ?? 0) >= 0 : true;
  const color = isUp ? '#34d399' : '#f43f5e';
  const colorGlow = isUp ? 'rgba(52, 211, 153, 0.2)' : 'rgba(244, 63, 94, 0.2)';

  const chartData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(d => ({
      ...d,
      date: new Date(d.timestamp).toISOString(),
      body: [d.open, d.close].sort((a, b) => a - b), // for composed chart candles
      wick: [d.low, d.high].sort((a, b) => a - b),
      isGrowing: d.close >= d.open
    }));
  }, [data?.data]);

  const handleAskAI = () => {
    setIsOpen(true);
    // Let the context builder handle the prompt automatically based on active state
  };

  const handleExplainMovement = (point: OHLCVPoint) => {
    setIsOpen(true);
    sendMessage(`Can you explain the market movement for ${ticker} on ${new Date(point.timestamp).toLocaleDateString()}? The price went from $${point.open.toFixed(2)} to $${point.close.toFixed(2)} with a volume of ${point.volume.toLocaleString()}.`);
  };

  if (error) {
    return (
      <GlassCard className="p-6 my-6 border-rose-500/20">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Activity className="w-8 h-8 text-rose-400 mb-3" />
          <h3 className="text-zinc-200 font-medium mb-1">Market Data Unavailable</h3>
          <p className="text-zinc-500 text-sm">{error}</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6 my-6">
      <GlassCard className="overflow-hidden">
        {/* Chart Header */}
        <div className="p-5 md:p-6 border-b border-white/5 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-bold text-zinc-100 font-[family-name:var(--font-outfit)]">
                {ticker}
              </h3>
              <span className="text-sm text-zinc-400">{companyName}</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              {isLoading && !data ? (
                <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
              ) : data ? (
                <>
                  <span className="text-3xl font-mono font-medium text-white">
                    {formatCurrency(data.currentPrice)}
                  </span>
                  {data.summary && (
                    <span className={`flex items-center gap-1 font-mono font-medium ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {isUp ? '+' : ''}{(data.currentPrice - data.summary.startPrice).toFixed(2)} ({isUp ? '+' : ''}{data.summary.percentageReturn.toFixed(2)}%)
                    </span>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* Range Selector */}
            <div className="flex bg-zinc-900/80 p-1 rounded-lg border border-white/5 overflow-x-auto custom-scrollbar">
              {MARKET_RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${range === r ? 'text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {range === r && (
                    <motion.div
                      layoutId="activeRange"
                      className="absolute inset-0 bg-zinc-800 rounded-md border border-white/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{r}</span>
                </button>
              ))}
            </div>

            {/* Tools */}
            <div className="flex items-center justify-end gap-2">
              <div className="flex bg-zinc-900/80 p-1 rounded-lg border border-white/5">
                <button onClick={() => setMode('area')} className={`p-1.5 rounded-md transition-colors ${mode === 'area' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500'}`} title="Area Chart"><AreaChart className="w-4 h-4" /></button>
                <button onClick={() => setMode('line')} className={`p-1.5 rounded-md transition-colors ${mode === 'line' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500'}`} title="Line Chart"><LineChart className="w-4 h-4" /></button>
                <button onClick={() => setMode('candlestick')} className={`p-1.5 rounded-md transition-colors ${mode === 'candlestick' ? 'bg-zinc-800 text-indigo-400' : 'text-zinc-500'}`} title="Candlestick Chart"><CandlestickChart className="w-4 h-4" /></button>
              </div>
              <button 
                onClick={() => setShowVolume(!showVolume)}
                className={`p-1.5 rounded-lg border ${showVolume ? 'bg-zinc-800 border-white/10 text-zinc-300' : 'bg-transparent border-white/5 text-zinc-600'}`}
                title="Toggle Volume"
              >
                {showVolume ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <div className="p-2 md:p-6 relative">
          {isLoading && !data && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0a0a10]/50 backdrop-blur-sm">
              <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
          )}

          <div className="h-[300px] md:h-[400px] w-full">
            {chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  
                  <XAxis 
                    dataKey="date" 
                    xAxisId={0}
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    minTickGap={40}
                    tickFormatter={(str) => {
                      const d = new Date(str);
                      return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`;
                    }}
                  />
                  <XAxis dataKey="date" xAxisId={1} hide />
                  <XAxis dataKey="date" xAxisId={2} hide />

                  <YAxis 
                    yAxisId="price"
                    domain={['auto', 'auto']} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#71717a', fontSize: 10 }}
                    tickFormatter={(val) => `$${val}`}
                    width={55}
                    orientation="right"
                  />
                  {showVolume && (
                    <YAxis 
                      yAxisId="volume" 
                      domain={[0, 'auto']} 
                      hide 
                    />
                  )}

                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
                  
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 16, 0.95)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      backdropFilter: 'blur(8px)',
                      boxShadow: `0 8px 32px ${colorGlow}`,
                      zIndex: 100
                    }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                    content={(props) => {
                      if (!props.active || !props.payload || props.payload.length === 0) return null;
                      const p = props.payload[0].payload as OHLCVPoint;
                      return (
                        <div className="p-3 shadow-xl">
                          <div className="text-zinc-400 text-xs mb-2 pb-2 border-b border-white/5">
                            {new Date(p.timestamp).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm font-mono mb-3">
                            <div className="flex justify-between gap-3"><span className="text-zinc-500">O</span> <span className="text-zinc-200">{formatCurrency(p.open)}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-zinc-500">H</span> <span className="text-zinc-200">{formatCurrency(p.high)}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-zinc-500">L</span> <span className="text-zinc-200">{formatCurrency(p.low)}</span></div>
                            <div className="flex justify-between gap-3"><span className="text-zinc-500">C</span> <span className="text-zinc-200">{formatCurrency(p.close)}</span></div>
                          </div>
                          {showVolume && (
                            <div className="flex justify-between gap-3 text-xs font-mono pt-2 border-t border-white/5">
                              <span className="text-zinc-500">Vol</span> <span className="text-zinc-300">{p.volume.toLocaleString()}</span>
                            </div>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleExplainMovement(p); }}
                            className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-medium transition-colors border border-indigo-500/20"
                          >
                            <HelpCircle className="w-3.5 h-3.5" /> Explain Move
                          </button>
                        </div>
                      );
                    }}
                  />

                  {showVolume && (
                    <Bar yAxisId="volume" xAxisId={2} dataKey="volume" fill="rgba(255,255,255,0.05)" barSize={4} />
                  )}

                  {mode === 'area' && (
                    <Area 
                      yAxisId="price"
                      xAxisId={0}
                      type="monotone" 
                      dataKey="close" 
                      stroke={color} 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      isAnimationActive={false}
                    />
                  )}
                  
                  {mode === 'line' && (
                    <Line 
                      yAxisId="price"
                      xAxisId={0}
                      type="monotone" 
                      dataKey="close" 
                      stroke={color} 
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  )}

                  {mode === 'candlestick' && (
                    <>
                      <Bar yAxisId="price" xAxisId={1} dataKey="wick" barSize={2}>
                        {chartData.map((entry, index) => (
                          <Cell key={`wick-${index}`} fill={entry.isGrowing ? '#34d399' : '#f43f5e'} />
                        ))}
                      </Bar>
                      <Bar yAxisId="price" xAxisId={0} dataKey="body" barSize={8}>
                        {chartData.map((entry, index) => (
                          <Cell key={`body-${index}`} fill={entry.isGrowing ? '#34d399' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </>
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-4 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
          <div className="flex gap-4 text-xs font-mono text-zinc-500">
            {data?.summary && (
              <>
                <span>H: <span className="text-zinc-300">{formatCurrency(data.summary.highestPrice)}</span></span>
                <span>L: <span className="text-zinc-300">{formatCurrency(data.summary.lowestPrice)}</span></span>
                <span className="hidden md:inline">Avg Vol: <span className="text-zinc-300">{data.summary.averageVolume.toLocaleString()}</span></span>
              </>
            )}
          </div>
          <button 
            onClick={handleAskAI}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-sm font-medium transition-colors"
          >
            <Bot className="w-4 h-4" /> Ask AI About Chart
          </button>
        </div>
      </GlassCard>

      {/* AI Insights & Fundamentals Grid */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ChartAiInsight summary={data.summary} anomalies={data.anomalies} />
          </div>
          <div className="md:col-span-1">
            <MarketFundamentalsInsight 
              recommendation={recommendation}
              riskScore={riskScore}
              financialAnalysis={financialAnalysis}
              summary={data.summary}
            />
          </div>
        </div>
      )}
    </div>
  );
}
