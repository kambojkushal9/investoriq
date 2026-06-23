'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Sparkles, ArrowRight, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/shared/glass-card';
import { ResearchProgress } from '@/components/dashboard/research-progress';
import { useResearch } from '@/hooks/use-research';
import { POPULAR_COMPANIES } from '@/config/constants';
import { RecommendationBadge } from '@/components/dashboard/recommendation-badge';
import { ScoreCard } from '@/components/dashboard/score-card';
import { SWOTAnalysis } from '@/components/dashboard/swot-analysis';
import { DebateView } from '@/components/dashboard/debate-view';
import { RiskMatrix } from '@/components/dashboard/risk-matrix';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { isLoading, currentStep, completedSteps, result, error, startResearch, reset } = useResearch();

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
        <h1 className="text-2xl font-bold text-zinc-100 mb-1">Research Dashboard</h1>
        <p className="text-sm text-zinc-500">Enter a company name to begin AI-powered analysis</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search a company... (e.g., Tesla, Apple, NVIDIA)"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                disabled={isLoading}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSearch(query)}
              disabled={isLoading || !query.trim()}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Analyze
            </motion.button>
          </div>

          {/* Quick suggestions */}
          {!isLoading && !hasResult && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-zinc-500 py-1">Quick:</span>
              {POPULAR_COMPANIES.map((c) => (
                <button
                  key={c.ticker}
                  onClick={() => { setQuery(c.name); handleSearch(c.name); }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-indigo-500/30 transition-all"
                >
                  {c.name} <span className="text-zinc-600">({c.ticker})</span>
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Research Progress */}
      {isLoading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-semibold text-zinc-100">Analyzing {query}</h2>
                <p className="text-xs text-zinc-500">Our AI agents are working together...</p>
              </div>
            </div>
            <ResearchProgress currentStep={currentStep} completedSteps={completedSteps} error={error} />
          </GlassCard>
        </motion.div>
      )}

      {/* Results */}
      {hasResult && result && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Company Header + Recommendation */}
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-zinc-100">
                    {result.companyResearch?.name || result.company}
                  </h2>
                  <span className="text-sm font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {result.ticker}
                  </span>
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
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        ${result.financialAnalysis.metrics.currentPrice.toFixed(2)}
                      </span>
                    </>
                  ) : null}
                  {result.financialAnalysis?.metrics.marketCap ? (
                    <>
                      <span className="text-zinc-600">·</span>
                      <span>MCap: {formatCurrency(result.financialAnalysis.metrics.marketCap)}</span>
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
              <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                <h3 className="text-sm font-semibold text-zinc-300 mb-2">Investment Thesis</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{result.recommendation.investmentThesis}</p>
                <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                  {result.recommendation.priceTarget && (
                    <span>Target: {result.recommendation.priceTarget}</span>
                  )}
                  {result.recommendation.timeHorizon && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.recommendation.timeHorizon}
                    </span>
                  )}
                </div>
              </div>
            )}
          </GlassCard>

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
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Company Overview</h3>
                <p className="text-sm text-zinc-400 mb-3">{result.companyResearch.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-500">CEO</span><span className="text-zinc-300">{result.companyResearch.ceo}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Founded</span><span className="text-zinc-300">{result.companyResearch.founded}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">HQ</span><span className="text-zinc-300">{result.companyResearch.headquarters}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Employees</span><span className="text-zinc-300">{result.companyResearch.employees}</span></div>
                </div>
                {result.companyResearch.products?.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-zinc-500">Key Products:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.companyResearch.products.map((p, i) => (
                        <span key={i} className="text-xs bg-zinc-800/50 px-2 py-0.5 rounded text-zinc-400">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </GlassCard>
            )}

            {/* Financial Summary */}
            {result.financialAnalysis && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Financial Summary</h3>
                <p className="text-sm text-zinc-400 mb-3">{result.financialAnalysis.analysis}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-500">P/E Ratio</span><span className="text-zinc-300">{result.financialAnalysis.metrics.peRatio?.toFixed(1) || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">EPS</span><span className="text-zinc-300">${result.financialAnalysis.metrics.eps?.toFixed(2) || 'N/A'}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">52W Range</span><span className="text-zinc-300">${result.financialAnalysis.metrics.fiftyTwoWeekLow?.toFixed(0) || '?'} - ${result.financialAnalysis.metrics.fiftyTwoWeekHigh?.toFixed(0) || '?'}</span></div>
                </div>
              </GlassCard>
            )}

            {/* News Intelligence */}
            {result.newsIntelligence && (
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">News Intelligence</h3>
                <p className="text-sm text-zinc-400 mb-3">{result.newsIntelligence.analysis}</p>
                <div className="space-y-2">
                  {result.newsIntelligence.articles?.slice(0, 3).map((a, i) => (
                    <div key={i} className="p-2 rounded-lg bg-zinc-900/50 text-xs">
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
              <GlassCard className="p-6">
                <h3 className="text-sm font-semibold text-zinc-300 mb-4">Market Sentiment</h3>
                <p className="text-sm text-zinc-400 mb-3">{result.marketSentiment.analysis}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-zinc-500">Sentiment Score</span><span className="text-zinc-300">{result.marketSentiment.sentimentScore}/100</span></div>
                  <div className="flex justify-between"><span className="text-zinc-500">Analyst Consensus</span><span className="text-zinc-300">{result.marketSentiment.analystConsensus}</span></div>
                </div>
              </GlassCard>
            )}
          </div>

          {/* New Research button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => { reset(); setQuery(''); }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800/50 border border-white/10 text-zinc-300 hover:text-zinc-100 hover:border-indigo-500/30 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
              Research Another Company
            </button>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {!isLoading && !hasResult && result?.errors && result.errors.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
          <GlassCard className="p-8 border-red-500/20 bg-red-500/5 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-red-300 mb-2">Research Failed</h2>
            <p className="text-sm text-red-400/80 mb-4">Some agents encountered errors during the analysis.</p>
            <div className="text-sm text-red-400/80 space-y-2 text-left bg-red-950/30 p-4 rounded-lg">
              {result.errors.map((err, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-red-500 flex-shrink-0">•</span>
                  <span>{err}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !hasResult && (!result?.errors || result.errors.length === 0) && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-300 mb-2">Ready to Research</h2>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Enter a company name above to activate our 6 AI agents.
            They&apos;ll analyze the company from every angle and deliver a recommendation.
          </p>
        </motion.div>
      )}
    </div>
  );
}
