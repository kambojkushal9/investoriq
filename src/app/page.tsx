'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnimatedBackground } from '@/components/shared/animated-background';
import { ArrowRight, Brain, Building2, TrendingUp, Newspaper, MessageSquare, ShieldAlert, Award, Sparkles } from 'lucide-react';

const agents = [
  { icon: Building2, name: 'Company Research', desc: 'Business model, leadership, competitive moat', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { icon: TrendingUp, name: 'Financial Analyst', desc: 'Revenue, profitability, valuation metrics', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { icon: Newspaper, name: 'News Intelligence', desc: 'Latest news, acquisitions, regulations', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
  { icon: MessageSquare, name: 'Market Sentiment', desc: 'Social media, Reddit, analyst consensus', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { icon: ShieldAlert, name: 'Risk Assessment', desc: 'Financial, market, industry, regulatory risk', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { icon: Award, name: 'Investment Committee', desc: 'Final recommendation with confidence score', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
];

const stats = [
  { value: '6', label: 'AI Agents' },
  { value: '50+', label: 'Data Points' },
  { value: '<60s', label: 'Analysis Time' },
  { value: '100%', label: 'Free & Open' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg gradient-text">InvestorIQ</span>
        </div>
        <Link href="/dashboard">
          <button className="px-4 py-2 text-sm font-medium text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-500/10 transition-colors">
            Launch App
          </button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Multi-Agent AI Architecture
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="gradient-text">AI Investment</span>
            <br />
            <span className="text-zinc-100">Intelligence Platform</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Research any company using autonomous AI analysts.
            Get institutional-grade investment recommendations in seconds.
          </p>

          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg transition-colors shadow-lg shadow-indigo-500/25"
            >
              Start Research
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto"
        >
          {stats.map((s, i) => (
            <div key={i} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Agents Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-zinc-100 mb-3">6 Autonomous AI Analysts</h2>
          <p className="text-zinc-400">Working together like a team of Wall Street professionals</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card glass-card-hover p-6 ${agent.border} border`}
            >
              <div className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center mb-4`}>
                <agent.icon className={`w-5 h-5 ${agent.color}`} />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2">{agent.name}</h3>
              <p className="text-sm text-zinc-400">{agent.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-zinc-100 mb-6">Agent Pipeline</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {agents.map((agent, i) => (
              <div key={agent.name} className="flex items-center gap-2">
                <div className={`${agent.bg} ${agent.border} border px-3 py-1.5 rounded-lg flex items-center gap-2`}>
                  <agent.icon className={`w-3.5 h-3.5 ${agent.color}`} />
                  <span className="text-xs font-medium text-zinc-300">{agent.name}</span>
                </div>
                {i < agents.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            Each agent builds on the previous agent&apos;s findings for comprehensive analysis
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center">
        <p className="text-sm text-zinc-500">
          Built with Next.js, LangGraph, and Gemini AI · Open Source
        </p>
      </footer>
    </div>
  );
}
