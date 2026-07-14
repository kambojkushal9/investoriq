'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, TrendingUp, Clock, AlertCircle, Brain, Command } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { AIOrb } from '@/components/shared/ai-orb';
import { CounterNumber } from '@/components/shared/counter-number';
import { ResearchProgress } from '@/components/dashboard/research-progress';
import { useResearch } from '@/hooks/use-research';
import { POPULAR_COMPANIES } from '@/config/constants';
import { RecommendationBadge } from '@/components/dashboard/recommendation-badge';
import { ScoreCard } from '@/components/dashboard/score-card';
import { SWOTAnalysis } from '@/components/dashboard/swot-analysis';
import { DebateView } from '@/components/dashboard/debate-view';
import { RiskMatrix } from '@/components/dashboard/risk-matrix';
import { TradingChart } from '@/components/dashboard/trading-chart';
import { formatCurrency } from '@/lib/utils';
import { useCopilot } from '@/components/copilot/copilot-provider';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const { isLoading, currentStep, completedSteps, result, error, startResearch, reset } = useResearch();
  const { setResearchState } = useCopilot();

  // Sync research state to copilot context
  useEffect(() => {
    setResearchState(result);
  }, [result, setResearchState]);

  const handleSearch = (company: string) => {
    const searchTerm = company || query;
    if (!searchTerm.trim()) return;
    setQuery(searchTerm);
    startResearch(searchTerm);
  };

  const hasResult = result?.recommendation;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 mb-1 font-[family-name:var(--font-outfit)]">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'Investor'}
        </h1>
        <p className="text-sm text-zinc-500">Enter a company name to begin AI-powered analysis</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search a company... (e.g., Tesla, Apple, NVIDIA)"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 input-premium focus:outline-none transition-all"
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 text-zinc-600">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800/80 border border-white/10 text-[10px] font-mono">⏎</kbd>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch(query)}
              disabled={isLoading || !query.trim()}
              className="px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Analyze
            </motion.button>
          </div>

          {/* Quick suggestions */}
          <AnimatePresence>
            {!isLoading && !hasResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mt-4"
              >
                <span className="text-xs text-zinc-500 py-1.5">Popular:</span>
                {POPULAR_COMPANIES.map((c, i) => (
                  <motion.button
                    key={c.ticker}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    whileHover={{ scale: 1.05, y: -1 }}
                    onClick={() => { setQuery(c.name); handleSearch(c.name); }}
                    className="text-xs px-3.5 py-1.5 rounded-lg bg-zinc-800/60 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                  >
                    {c.name} <span className="text-zinc-600 font-mono">({c.ticker})</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </motion.div>

      {/* Research Progress */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="p-6 mb-6 gradient-border-animated rounded-2xl">
              <div className="flex items-center gap-4 mb-5">
                <motion.div
                  className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20"
                  animate={{ boxShadow: ['0 0 0 rgba(99,102,241,0)', '0 0 20px rgba(99,102,241,0.2)', '0 0 0 rgba(99,102,241,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-5 h-5 text-indigo-400" />
                </motion.div>
                <div>
                  <h2 className="font-semibold text-zinc-100 font-[family-name:var(--font-outfit)]">Analyzing {query}</h2>
                  <p className="text-xs text-zinc-500">Our AI agents are collaborating on your research...</p>
                </div>
              </div>
              <ResearchProgress currentStep={currentStep} completedSteps={completedSteps} error={error} />
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {hasResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Company Header + Recommendation */}
            <GlassCard className="p-6" tilt>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <motion.h2
                      className="text-2xl font-bold text-zinc-100 font-[family-name:var(--font-outfit)]"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {result.companyResearch?.name || result.company}
                    </motion.h2>
                    <motion.span
                      className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {result.ticker}
                    </motion.span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                    {result.companyResearch?.sector && (
                      <span>{result.companyResearch.sector}</span>
                    )}
                    {result.companyResearch?.industry && (
                      <span className="text-zinc-600">·</span>
                    )}
                    {result.companyResearch?.industry && (
                      <span>{result.companyResearch.industry}</span>
                    )}
                    {result.financialAnalysis?.metrics.currentPrice ? (
                      <>
                        <span className="text-zinc-600">·</span>
                        <span className="flex items-center gap-1 font-mono">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                          <CounterNumber value={result.financialAnalysis.metrics.currentPrice} prefix="$" decimals={2} className="text-zinc-200 font-medium" />
                        </span>
                      </>
                    ) : null}
                    {result.financialAnalysis?.metrics.marketCap ? (
                      <>
                        <span className="text-zinc-600">·</span>
                        <span className="font-mono">MCap: {formatCurrency(result.financialAnalysis.metrics.marketCap)}</span>
                      </>
                    ) : null}
                  </div>
                </div>
                {result.recommendation && (
                  <RecommendationBadge
                    recommendation={result.recommendation.recommendation}
                    confidence={result.recommendation.confidence}
                  />
                )}
              </div>

              {/* Investment Thesis */}
              {result.recommendation?.investmentThesis && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 p-5 rounded-xl bg-zinc-900/50 border border-white/5"
                >
                  <h3 className="text-sm font-semibold text-zinc-300 mb-2">Investment Thesis</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{result.recommendation.investmentThesis}</p>
                  <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                    {result.recommendation.priceTarget && (
                      <span className="font-mono">Target: {result.recommendation.priceTarget}</span>
                    )}
                    {result.recommendation.timeHorizon && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {result.recommendation.timeHorizon}
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </GlassCard>

            {/* Trading Chart — NEW */}
            {result.ticker && (
              <TradingChart 
                ticker={result.ticker}
                companyName={result.companyResearch?.name || result.company}
                recommendation={result.recommendation}
                riskScore={result.riskAssessment?.overallRiskScore}
                financialAnalysis={result.financialAnalysis}
              />
            )}

            {/* Scorecard */}
            {result.recommendation?.scores && (
              <ScoreCard scores={result.recommendation.scores} />
            )}

            {/* Bull vs Bear Debate */}
            {result.recommendation?.bullCase && result.recommendation?.bearCase && (
              <DebateView
                bullCase={result.recommendation.bullCase}
                bearCase={result.recommendation.bearCase}
              />
            )}

            {/* SWOT */}
            {result.recommendation?.swot && (
              <SWOTAnalysis swot={result.recommendation.swot} />
            )}

            {/* Risk Matrix */}
            {result.riskAssessment && (
              <RiskMatrix riskData={result.riskAssessment} />
            )}

            {/* Agent Detail Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Research */}
              {result.companyResearch && (
                <GlassCard className="p-6" tilt>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 font-[family-name:var(--font-outfit)]">Company Overview</h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{result.companyResearch.description}</p>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between"><span className="text-zinc-500">CEO</span><span className="text-zinc-300 font-medium">{result.companyResearch.ceo}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Founded</span><span className="text-zinc-300">{result.companyResearch.founded}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">HQ</span><span className="text-zinc-300">{result.companyResearch.headquarters}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">Employees</span><span className="text-zinc-300">{result.companyResearch.employees}</span></div>
                  </div>
                  {result.companyResearch.products?.length > 0 && (
                    <div className="mt-4">
                      <span className="text-xs text-zinc-500">Key Products:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {result.companyResearch.products.map((p, i) => (
                          <span key={i} className="text-xs bg-zinc-800/50 px-2.5 py-1 rounded-lg text-zinc-400 border border-white/5">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Financial Summary */}
              {result.financialAnalysis && (
                <GlassCard className="p-6" tilt>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 font-[family-name:var(--font-outfit)]">Financial Summary</h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{result.financialAnalysis.analysis}</p>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between"><span className="text-zinc-500">P/E Ratio</span><span className="text-zinc-300 font-mono">{result.financialAnalysis.metrics.peRatio?.toFixed(1) || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">EPS</span><span className="text-zinc-300 font-mono">${result.financialAnalysis.metrics.eps?.toFixed(2) || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-zinc-500">52W Range</span><span className="text-zinc-300 font-mono">${result.financialAnalysis.metrics.fiftyTwoWeekLow?.toFixed(0) || '?'} - ${result.financialAnalysis.metrics.fiftyTwoWeekHigh?.toFixed(0) || '?'}</span></div>
                  </div>
                </GlassCard>
              )}

              {/* News Intelligence */}
              {result.newsIntelligence && (
                <GlassCard className="p-6" tilt>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 font-[family-name:var(--font-outfit)]">News Intelligence</h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{result.newsIntelligence.analysis}</p>
                  <div className="space-y-2">
                    {result.newsIntelligence.articles?.slice(0, 3).map((a, i) => (
                      <div key={i} className="p-3 rounded-xl bg-zinc-900/50 text-xs border border-white/5 hover:border-white/10 transition-colors">
                        <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                          a.sentiment === 'positive' ? 'bg-emerald-400' :
                          a.sentiment === 'negative' ? 'bg-rose-400' : 'bg-zinc-400'
                        }`} />
                        <span className="text-zinc-300">{a.title}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Market Sentiment */}
              {result.marketSentiment && (
                <GlassCard className="p-6" tilt>
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 font-[family-name:var(--font-outfit)]">Market Sentiment</h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{result.marketSentiment.analysis}</p>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Sentiment Score</span>
                      <span className="text-zinc-300 font-mono font-medium">{result.marketSentiment.sentimentScore}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Analyst Consensus</span>
                      <span className="text-zinc-300 font-medium">{result.marketSentiment.analystConsensus}</span>
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>

            {/* New Research button */}
            <div className="flex justify-center pt-4">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { reset(); setQuery(''); }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-300 hover:text-zinc-100 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
              >
                <ArrowRight className="w-4 h-4" />
                Research Another Company
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {!isLoading && !hasResult && result?.errors && result.errors.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-5 border border-red-500/20"
              animate={{ boxShadow: ['0 0 0 rgba(239,68,68,0)', '0 0 20px rgba(239,68,68,0.15)', '0 0 0 rgba(239,68,68,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertCircle className="w-7 h-7 text-red-400" />
            </motion.div>
            <h2 className="text-xl font-semibold text-red-300 mb-2 font-[family-name:var(--font-outfit)]">Research Encountered Issues</h2>
            <p className="text-sm text-zinc-400 mb-5">Some agents encountered errors. The AI is still learning.</p>
            <div className="text-sm text-zinc-400 space-y-2 text-left bg-red-950/20 p-4 rounded-xl border border-red-500/10">
              {result.errors.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-red-500 flex-shrink-0">•</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { reset(); setQuery(''); }}
              className="mt-5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Try Again
            </motion.button>
          </GlassCard>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !hasResult && (!result?.errors || result.errors.length === 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-16">
          <motion.div
            className="mb-6"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AIOrb size={100} intensity="low" className="mx-auto" />
          </motion.div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2 font-[family-name:var(--font-outfit)]">Ready to Research</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            Enter a company name above to activate our 6 AI agents.
            They&apos;ll analyze the company from every angle and deliver a comprehensive recommendation.
          </p>
        </motion.div>
      )}
    </div>
  );
}
