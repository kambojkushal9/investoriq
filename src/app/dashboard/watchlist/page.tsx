'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Star, Trash2, Plus, TrendingUp } from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { useState } from 'react';

export default function WatchlistPage() {
  const { items, isLoading, addItem, removeItem } = useWatchlist();
  const [company, setCompany] = useState('');
  const [ticker, setTicker] = useState('');

  const handleAdd = async () => {
    if (!company || !ticker) return;
    await addItem(company, ticker.toUpperCase());
    setCompany('');
    setTicker('');
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1">
          <Star className="w-6 h-6 text-amber-400" />
          Watchlist
        </h1>
        <p className="text-sm text-zinc-500">Track companies you&apos;re interested in</p>
      </motion.div>

      {/* Add Form */}
      <GlassCard className="p-5 mb-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company name"
            className="flex-1 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
          />
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Ticker"
            className="w-28 bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all uppercase"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            disabled={!company || !ticker}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </motion.button>
        </div>
      </GlassCard>

      {/* Watchlist Items */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Star className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-zinc-300 mb-2">Watchlist Empty</h2>
          <p className="text-sm text-zinc-500">Add companies above to track them.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-100 text-sm">{item.company}</h3>
                      <span className="text-xs font-mono text-zinc-500">{item.ticker}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
