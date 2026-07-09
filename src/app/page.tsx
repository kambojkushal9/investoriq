'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AnimatedBackground } from '@/components/shared/animated-background';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { AIOrb } from '@/components/shared/ai-orb';
import { StockTickerBar } from '@/components/shared/stock-ticker-bar';
import { ArrowRight, Brain, Building2, TrendingUp, Newspaper, MessageSquare, ShieldAlert, Award, Sparkles, Zap, Globe, LineChart, Shield, BarChart3, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

const agents = [
  { icon: Building2, name: 'Company Research', desc: 'Business model, leadership, competitive moat', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', gradient: 'from-blue-500/20 to-blue-600/5' },
  { icon: TrendingUp, name: 'Financial Analyst', desc: 'Revenue, profitability, valuation metrics', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', gradient: 'from-emerald-500/20 to-emerald-600/5' },
  { icon: Newspaper, name: 'News Intelligence', desc: 'Latest news, acquisitions, regulations', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', gradient: 'from-cyan-500/20 to-cyan-600/5' },
  { icon: MessageSquare, name: 'Market Sentiment', desc: 'Social media, Reddit, analyst consensus', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', gradient: 'from-violet-500/20 to-violet-600/5' },
  { icon: ShieldAlert, name: 'Risk Assessment', desc: 'Financial, market, industry, regulatory risk', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', gradient: 'from-amber-500/20 to-amber-600/5' },
  { icon: Award, name: 'Investment Committee', desc: 'Final recommendation with confidence score', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', gradient: 'from-rose-500/20 to-rose-600/5' },
];

const stats = [
  { value: '6', label: 'AI Agents', icon: Brain },
  { value: '50+', label: 'Data Points', icon: BarChart3 },
  { value: '<60s', label: 'Analysis Time', icon: Zap },
  { value: '100%', label: 'Free & Open', icon: Globe },
];

const features = [
  { icon: LineChart, title: 'Real-Time Analysis', desc: 'Live financial data from Yahoo Finance, Alpha Vantage, and Finnhub', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { icon: Brain, title: 'Multi-Agent AI', desc: 'Six specialized agents collaborate like a Wall Street research team', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { icon: Shield, title: 'Risk Intelligence', desc: 'Comprehensive risk assessment across financial, market, and regulatory dimensions', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: BarChart3, title: 'Investment Scorecard', desc: 'Quantitative scores across financial health, growth, moat, and sentiment', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
];

const titleWords = ['AI', 'Investment'];
const subtitleWords = ['Intelligence', 'Platform'];

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen relative overflow-hidden mouse-spotlight">
      <AnimatedBackground />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#07070a]/60 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
            <Brain className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg font-[family-name:var(--font-outfit)] gradient-text">InvestorIQ</span>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 text-sm font-medium text-indigo-300 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/10 transition-all duration-300 backdrop-blur-sm"
          >
            Launch App
          </motion.button>
        </Link>
      </motion.nav>

      {/* Hero */}
      <section
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-12 text-center min-h-[85vh] flex flex-col items-center justify-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-10 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Multi-Agent AI Architecture
          </div>
        </motion.div>

        {/* AI Orb */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-10"
        >
          <AIOrb size={140} intensity="high" />
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 font-[family-name:var(--font-outfit)]">
          <span className="block">
            {titleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + i * 0.15 }}
                className="gradient-text inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="block mt-1">
            {subtitleWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + i * 0.15 }}
                className="text-zinc-100 inline-block mr-4"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Research any company using autonomous AI analysts.
          Get institutional-grade investment recommendations in seconds.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Link href="/dashboard">
            <MagneticButton
              className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-lg shadow-2xl shadow-indigo-500/25 border border-indigo-400/20"
            >
              Start Research
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-2xl mx-auto w-full"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              className="glass-card p-4 text-center card-reflection"
            >
              <s.icon className="w-4 h-4 text-indigo-400/60 mx-auto mb-2" />
              <div className="text-2xl font-bold gradient-text font-[family-name:var(--font-outfit)]">{s.value}</div>
              <div className="text-[11px] text-zinc-500 mt-1 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-zinc-600" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stock Ticker */}
      <div className="relative z-[100]">
        <StockTickerBar />
      </div>

      {/* Agents Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
            Multi-Agent Architecture
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4 font-[family-name:var(--font-outfit)]">
            6 Autonomous AI Analysts
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Working together like a team of Wall Street professionals to deliver comprehensive investment intelligence</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={`glass-card glass-card-hover card-reflection p-6 ${agent.border} border bg-gradient-to-br ${agent.gradient}`}
            >
              <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center mb-4 border ${agent.border}`}>
                <agent.icon className={`w-5 h-5 ${agent.color}`} />
              </div>
              <h3 className="font-semibold text-zinc-100 mb-2 text-[15px]">{agent.name}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{agent.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pipeline visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8 text-center gradient-border-animated rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-zinc-100 mb-6 font-[family-name:var(--font-outfit)]">Agent Pipeline</h3>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {agents.map((agent, i) => (
              <div key={agent.name} className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`${agent.bg} ${agent.border} border px-3 py-1.5 rounded-lg flex items-center gap-2`}
                >
                  <agent.icon className={`w-3.5 h-3.5 ${agent.color}`} />
                  <span className="text-xs font-medium text-zinc-300">{agent.name}</span>
                </motion.div>
                {i < agents.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-zinc-500">
            Each agent builds on the previous agent&apos;s findings for comprehensive analysis
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-6">
            Platform Capabilities
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-zinc-100 mb-4 font-[family-name:var(--font-outfit)]">
            Institutional-Grade Intelligence
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">Everything you need to make informed investment decisions, powered by cutting-edge AI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover card-reflection p-8 group"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 text-center gradient-border-animated rounded-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
            <span className="gradient-text">Ready to Research?</span>
          </h2>
          <p className="text-zinc-400 mb-8 max-w-md mx-auto">
            Start analyzing any public company with our AI-powered research platform. Free and open source.
          </p>
          <Link href="/dashboard">
            <MagneticButton
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg shadow-xl shadow-indigo-500/20"
            >
              Launch Platform
              <ArrowRight className="w-5 h-5" />
            </MagneticButton>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-bold gradient-text font-[family-name:var(--font-outfit)]">InvestorIQ</span>
          </div>
          <p className="text-sm text-zinc-500">
            Built with Next.js, LangGraph, and Gemini AI · Open Source
          </p>
        </div>
      </footer>
    </div>
  );
}
