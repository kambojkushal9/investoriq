'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Settings as SettingsIcon, Key, Save, Check } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In production, this would save to server-side config
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1">
          <SettingsIcon className="w-6 h-6 text-zinc-400" />
          Settings
        </h1>
        <p className="text-sm text-zinc-500">Configure your InvestorIQ instance</p>
      </motion.div>

      <GlassCard className="p-6 mb-6">
        <h3 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-400" />
          API Configuration
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          API keys are configured via environment variables (.env.local). Set GOOGLE_API_KEY for Gemini AI.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Google API Key (Gemini)</label>
            <input
              type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
              placeholder="Set in .env.local as GOOGLE_API_KEY"
              className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="font-semibold text-zinc-100 mb-4">Environment Variables</h3>
        <div className="bg-zinc-900/80 rounded-xl p-4 font-mono text-xs space-y-1">
          <p className="text-zinc-500"># Required</p>
          <p className="text-emerald-400">GOOGLE_API_KEY=<span className="text-zinc-500">your_gemini_api_key</span></p>
          <p className="text-zinc-600 mt-2"># Optional - for enhanced data</p>
          <p className="text-zinc-500">ALPHA_VANTAGE_KEY=your_key</p>
          <p className="text-zinc-500">FINNHUB_KEY=your_key</p>
          <p className="text-zinc-500">NEWS_API_KEY=your_key</p>
          <p className="text-zinc-500">TAVILY_API_KEY=your_key</p>
        </div>
      </GlassCard>
    </div>
  );
}
