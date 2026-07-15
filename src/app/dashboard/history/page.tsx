'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { History, TrendingUp, Clock, ArrowRight, Search } from 'lucide-react';
import { getRecommendationClass } from '@/lib/utils';
import type { ResearchReport } from '@/lib/types';
import Link from 'next/link';

export default function HistoryPage() {
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    fetch('/api/history')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { setReports(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = reports.filter(r =>
    r.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.ticker.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1 font-[family-name:var(--font-outfit)]">
          <History className="w-6 h-6 text-indigo-400" />
          Research History
        </h1>
        <p className="text-sm text-zinc-500">Past research reports and recommendations</p>
      </motion.div>

      {/* Search Filter */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by company or ticker..."
              className="w-full bg-zinc-900/60 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 input-premium focus:outline-none"
            />
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton-v2 h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 && reports.length === 0 ? (
        <GlassCard className="p-14 text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-5" />
          </motion.div>
          <h2 className="text-lg font-semibold text-zinc-300 mb-2 font-[family-name:var(--font-outfit)]">No Research Yet</h2>
          <p className="text-sm text-zinc-500 mb-6">Start analyzing companies to build your research history.</p>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors inline-flex items-center gap-2"
            >
              Start Research <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link href={`/dashboard?reportId=${report.id}`} className="block">
                <GlassCard className="p-5 glass-card-hover" hover tilt>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-100">{report.company}</h3>
                          <span className="text-xs font-mono text-zinc-500">{report.ticker}</span>
                        </div>
                        <p className="text-xs text-zinc-500">
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`${getRecommendationClass(report.recommendation)} px-3.5 py-1 rounded-lg text-xs font-bold`}>
                        {report.recommendation}
                      </div>
                      <span className="text-xs text-zinc-500 font-mono">{report.confidence}%</span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
