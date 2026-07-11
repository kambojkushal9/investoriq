'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthBackground } from '@/components/auth/auth-background';
import { AICore } from '@/components/auth/ai-core';
import { LoginForm } from '@/components/auth/login-form';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { SignupForm } from '@/components/auth/signup-form';
import { useRouter } from 'next/navigation';

type AuthView = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [view, setView] = useState<AuthView>('login');
  const router = useRouter();

  const handleSuccess = () => {
    setIsSuccess(true);
    // Simulate AI sync transition before routing
    setTimeout(() => {
      router.push('/dashboard');
    }, 4000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050508] text-zinc-100">
      <AuthBackground />
      
      <div className="relative z-20 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: AI Core & Welcome Text */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left h-[500px] justify-center">
          <AICore expanded={isSuccess} />
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
                  System Online
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
                    {view === 'signup' ? 'Start building your' : 'Authenticate to access your'}
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                    AI Investment Workspace
                  </span>
                </h1>
                <p className="text-zinc-400 text-lg max-w-md mt-4 leading-relaxed">
                  {view === 'signup'
                    ? 'Create your account to unlock AI-powered research, watchlists, and portfolio intelligence.'
                    : 'Connect to the neural network. Restore your research, watchlists, and portfolio instantly.'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 w-full absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              >
                <h2 className="text-3xl font-bold font-[family-name:var(--font-outfit)] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-6 text-center">
                  Authentication Successful
                </h2>
                
                <div className="space-y-4 text-sm text-zinc-300 font-[family-name:var(--font-jetbrains)] flex flex-col items-center">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>
                    &gt; Synchronizing previous research... [OK]
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }}>
                    &gt; Restoring AI memory... [OK]
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }}>
                    &gt; Loading market intelligence... [OK]
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5 }} className="text-emerald-400 font-bold">
                    &gt; Entering workspace...
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Auth Panel */}
        <AnimatePresence>
          {!isSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: 100, scale: 0.9, filter: 'blur(20px)' }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="w-full max-w-md mx-auto perspective-1000"
            >
              <div className="bg-[#0c0c12]/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-shadow duration-500 relative group overflow-hidden">
                {/* Subtle border glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-violet-500/0 group-hover:from-indigo-500/10 group-hover:to-violet-500/10 transition-colors duration-500 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  {view === 'login' && (
                    <motion.div
                      key="login-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <LoginForm
                        onSuccess={handleSuccess}
                        onForgotPassword={() => setView('forgot')}
                        onSignup={() => setView('signup')}
                      />
                    </motion.div>
                  )}
                  {view === 'signup' && (
                    <motion.div
                      key="signup-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SignupForm
                        onSuccess={handleSuccess}
                        onBackToLogin={() => setView('login')}
                      />
                    </motion.div>
                  )}
                  {view === 'forgot' && (
                    <motion.div
                      key="forgot-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ForgotPasswordForm onBack={() => setView('login')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
