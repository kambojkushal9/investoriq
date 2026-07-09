'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/shared/glass-card';
import { Settings as SettingsIcon, Key, Save, Check, Shield, Zap } from 'lucide-react';

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const envVars = [
    { key: 'GOOGLE_API_KEY', label: 'Google Gemini', required: true },
    { key: 'ALPHA_VANTAGE_KEY', label: 'Alpha Vantage', required: false },
    { key: 'FINNHUB_KEY', label: 'Finnhub', required: false },
    { key: 'NEWS_API_KEY', label: 'NewsAPI', required: false },
    { key: 'TAVILY_API_KEY', label: 'Tavily', required: false },
  ];

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100 flex items-center gap-3 mb-1 font-[family-name:var(--font-outfit)]">
          <SettingsIcon className="w-6 h-6 text-zinc-400" /> Settings
        </h1>
        <p className="text-sm text-zinc-500">Configure your InvestorIQ instance</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <GlassCard className="p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-1 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" /> API Configuration
          </h3>
          <p className="text-xs text-zinc-500 mb-5">API keys are configured via environment variables (.env.local).</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 mb-1.5 block font-medium">Google API Key (Gemini)</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Set in .env.local as GOOGLE_API_KEY"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 input-premium focus:outline-none" />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl flex items-center gap-2 transition-colors">
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Settings'}
            </motion.button>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassCard className="p-6 mb-6">
          <h3 className="font-semibold text-zinc-100 mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" /> Environment Variables
          </h3>
          <div className="space-y-3">
            {envVars.map((v, i) => (
              <motion.div key={v.key} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <Zap className={`w-3.5 h-3.5 ${v.required ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <div>
                    <span className="text-sm font-mono text-emerald-400">{v.key}</span>
                    <span className="text-xs text-zinc-500 ml-2">{v.label}</span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.required ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-zinc-800 text-zinc-500'}`}>
                  {v.required ? 'Required' : 'Optional'}
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
