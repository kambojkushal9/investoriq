'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Activity, Loader2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ComposedChart, Bar, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ChartData {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
}

interface MarketData {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  high52: number;
  low52: number;
  chartData: ChartData[];
}

interface TradingChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
}

export function TradingChartModal({ isOpen, onClose, symbol }: TradingChartModalProps) {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const router = useRouter();

  useEffect(() => {
    if (!isOpen || !symbol) return;
    
    setLoading(true);
    setError(false);
    
    fetch(`/api/market/chart?symbol=${symbol}`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [isOpen, symbol]);

  const isUp = data ? data.change >= 0 : true;
  const color = isUp ? '#34d399' : '#f43f5e';
  const colorGlow = isUp ? 'rgba(52, 211, 153, 0.2)' : 'rgba(244, 63, 94, 0.2)';

  // Prepare candlestick data
  const candleData = data?.chartData.map(d => ({
    ...d,
    body: [d.open ?? d.price, d.price], // price is close
    wick: [d.low ?? d.price, d.high ?? d.price],
    isGrowing: d.price >= (d.open ?? d.price)
  })) || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-[#0a0a10]/95 border border-white/10 shadow-2xl rounded-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 md:p-6 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
              <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold text-zinc-100 font-[family-name:var(--font-outfit)]">{symbol}</h2>
                  {data && <span className="text-sm font-medium text-zinc-400 px-2.5 py-0.5 rounded-md bg-white/5 truncate max-w-[200px] md:max-w-none">{data.name}</span>}
                </div>
                {loading ? (
                  <div className="h-6 w-32 bg-white/5 rounded animate-pulse mt-2" />
                ) : data && !error ? (
                  <div className="flex flex-wrap items-baseline gap-3 mt-1">
                    <span className="text-3xl font-mono font-medium text-white">${data.currentPrice.toFixed(2)}</span>
                    <span className={`text-base md:text-lg font-mono font-medium flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isUp ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                      {isUp ? '+' : ''}{data.change.toFixed(2)} ({isUp ? '+' : ''}{(data.changePercent * 100).toFixed(2)}%)
                    </span>
                  </div>
                ) : (
                  <span className="text-rose-400 text-sm mt-2">Failed to load market data</span>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* Chart Toggle */}
                <div className="hidden md:flex bg-zinc-900/80 p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${chartType === 'line' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setChartType('candle')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${chartType === 'candle' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Candle
                  </button>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="p-5 md:p-6 overflow-y-auto flex-1 custom-scrollbar">
              {loading ? (
                <div className="h-[250px] md:h-[350px] flex flex-col items-center justify-center text-zinc-500">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="mb-4">
                    <Loader2 className="w-8 h-8 text-indigo-400" />
                  </motion.div>
                  <p className="text-sm font-medium">Fetching real-time market data...</p>
                </div>
              ) : error || !data ? (
                <div className="h-[250px] md:h-[350px] flex flex-col items-center justify-center text-zinc-500">
                  <Activity className="w-8 h-8 mb-4 text-zinc-700" />
                  <p className="text-sm font-medium">Data unavailable</p>
                </div>
              ) : (
                <>
                  {/* Chart */}
                  <div className="h-[250px] md:h-[350px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === 'line' ? (
                        <AreaChart data={data.chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            minTickGap={30}
                            tickFormatter={(str) => {
                              const date = new Date(str);
                              return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
                            }}
                          />
                          <YAxis 
                            domain={['auto', 'auto']} 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            tickFormatter={(val) => `$${val}`}
                            width={50}
                          />
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0a0a10', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              boxShadow: `0 8px 32px ${colorGlow}`
                            }}
                            itemStyle={{ color: '#fff', fontWeight: 500, fontFamily: 'monospace' }}
                            labelStyle={{ color: '#71717a', fontSize: '12px', marginBottom: '4px' }}
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            stroke={color} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorPrice)" 
                            animationDuration={1500}
                            animationEasing="ease-out"
                          />
                        </AreaChart>
                      ) : (
                        // Candlestick using ComposedChart
                        <ComposedChart data={candleData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                          {/* XAxis for the body */}
                          <XAxis 
                            dataKey="date" 
                            xAxisId={0}
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            minTickGap={30}
                            tickFormatter={(str) => {
                              const date = new Date(str);
                              return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}`;
                            }}
                          />
                          {/* Hidden XAxis for the wick to make them overlap */}
                          <XAxis dataKey="date" xAxisId={1} hide />
                          
                          <YAxis 
                            domain={['auto', 'auto']} 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 10 }}
                            tickFormatter={(val) => `$${val}`}
                            width={50}
                          />
                          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0a0a10', 
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '12px',
                              boxShadow: `0 8px 32px rgba(255,255,255,0.05)`
                            }}
                            itemStyle={{ display: 'none' }}
                            labelStyle={{ color: '#71717a', fontSize: '12px', marginBottom: '4px' }}
                            labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            formatter={(value: any, name: any, props: any) => {
                              const { open, price, high, low } = props.payload;
                              return [
                                <div key="custom-tooltip" className="text-xs font-mono space-y-1 mt-1 min-w-[100px]">
                                  <div className="flex gap-3 justify-between"><span className="text-zinc-500">O:</span> <span className="text-white">${open.toFixed(2)}</span></div>
                                  <div className="flex gap-3 justify-between"><span className="text-zinc-500">H:</span> <span className="text-white">${high.toFixed(2)}</span></div>
                                  <div className="flex gap-3 justify-between"><span className="text-zinc-500">L:</span> <span className="text-white">${low.toFixed(2)}</span></div>
                                  <div className="flex gap-3 justify-between"><span className="text-zinc-500">C:</span> <span className="text-white">${price.toFixed(2)}</span></div>
                                </div>
                              ];
                            }}
                          />
                          {/* Candle Wick (Low to High) */}
                          <Bar xAxisId={1} dataKey="wick" barSize={2}>
                            {candleData.map((entry, index) => (
                              <Cell key={`wick-${index}`} fill={entry.isGrowing ? '#34d399' : '#f43f5e'} />
                            ))}
                          </Bar>
                          {/* Candle Body (Open to Close) */}
                          <Bar xAxisId={0} dataKey="body" barSize={8}>
                            {candleData.map((entry, index) => (
                              <Cell key={`body-${index}`} fill={entry.isGrowing ? '#34d399' : '#f43f5e'} />
                            ))}
                          </Bar>
                        </ComposedChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Metrics Footer */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 font-medium">Volume</p>
                      <p className="text-sm font-mono text-zinc-200">{formatCurrency(data.volume).replace('$', '')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 font-medium">52 Week High</p>
                      <p className="text-sm font-mono text-emerald-400">${data.high52.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1 font-medium">52 Week Low</p>
                      <p className="text-sm font-mono text-rose-400">${data.low52.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-end col-span-2 md:col-span-1 mt-2 md:mt-0">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push(`/dashboard?q=${symbol}`)}
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        Deep AI Analysis <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
