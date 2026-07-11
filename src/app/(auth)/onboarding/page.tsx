'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthBackground } from '@/components/auth/auth-background';
import { AICore } from '@/components/auth/ai-core';
import { ArrowRight, Check } from 'lucide-react';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { useRouter } from 'next/navigation';

const styles = ['Conservative', 'Balanced', 'Aggressive'];
const sectors = ['Technology', 'Healthcare', 'Finance', 'Energy', 'Consumer', 'Real Estate'];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Complete onboarding
      // Optionally save to DB here
      router.push('/dashboard');
    }
  };

  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter(s => s !== sector));
    } else {
      if (selectedSectors.length < 3) {
        setSelectedSectors([...selectedSectors, sector]);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050508] text-zinc-100">
      <AuthBackground />
      
      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center h-screen">
        
        <div className="mb-12">
          <AICore expanded={step === 3} />
        </div>

        <div className="w-full max-w-2xl text-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-outfit)] mb-2">Initialize AI Preferences</h2>
                  <p className="text-zinc-400">Step 1: Choose your investment style</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {styles.map((style) => (
                    <motion.button
                      key={style}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedStyle(style)}
                      className={`p-6 rounded-2xl border transition-all ${
                        selectedStyle === style
                          ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <h3 className="font-semibold text-lg">{style}</h3>
                    </motion.button>
                  ))}
                </div>

                <MagneticButton
                  onClick={handleNext}
                  disabled={!selectedStyle}
                  className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium disabled:opacity-50 inline-flex items-center gap-2 transition-all"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-outfit)] mb-2">Target Industries</h2>
                  <p className="text-zinc-400">Step 2: Select up to 3 favorite sectors</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sectors.map((sector) => {
                    const isSelected = selectedSectors.includes(sector);
                    return (
                      <motion.button
                        key={sector}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleSector(sector)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-violet-500/20 border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <span className="font-medium">{sector}</span>
                        {isSelected && <Check className="w-4 h-4 text-violet-400" />}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-4 mt-8">
                  <button onClick={() => setStep(1)} className="px-8 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                    Back
                  </button>
                  <MagneticButton
                    onClick={handleNext}
                    disabled={selectedSectors.length === 0}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium disabled:opacity-50 inline-flex items-center gap-2 transition-all"
                  >
                    Finalize
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex flex-col items-center"
              >
                <h2 className="text-4xl font-bold font-[family-name:var(--font-outfit)] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                  Building Your AI Workspace
                </h2>
                
                <div className="space-y-4 text-sm text-zinc-300 font-[family-name:var(--font-jetbrains)] flex flex-col items-center">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    &gt; Applying {selectedStyle} investment parameters... [OK]
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                    &gt; Tracking {selectedSectors.join(', ')} sectors... [OK]
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.0 }} className="text-emerald-400 font-bold">
                    &gt; Workspace initialized.
                  </motion.div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8 }}>
                  <button
                    onClick={() => { window.location.href = '/dashboard'; }}
                    className="mt-8 px-10 py-4 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-lg inline-flex items-center gap-2 transition-all shadow-xl shadow-white/10 cursor-pointer"
                  >
                    Enter Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
