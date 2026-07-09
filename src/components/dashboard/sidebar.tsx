'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, History, Star, GitCompare, Settings, Brain, ChevronLeft, ChevronRight, Sparkles, Sliders, Timer } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/history', label: 'Research History', icon: History },
  { href: '/dashboard/watchlist', label: 'Watchlist', icon: Star },
  { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
  { href: '/dashboard/what-if', label: 'What-If Simulator', icon: Sliders },
  { href: '/dashboard/timeline', label: 'AI Timeline', icon: Timer },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'h-screen sticky top-0 border-r border-white/5 flex flex-col transition-all duration-300 z-40',
        'bg-[#07070a]/80 backdrop-blur-xl',
        collapsed ? 'w-[68px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/5 h-[65px]">
        <motion.div
          className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/20"
          whileHover={{ scale: 1.05 }}
          animate={{ boxShadow: ['0 0 10px rgba(99,102,241,0.1)', '0 0 20px rgba(99,102,241,0.2)', '0 0 10px rgba(99,102,241,0.1)'] }}
          transition={{ boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <Brain className="w-5 h-5 text-indigo-400" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg gradient-text whitespace-nowrap font-[family-name:var(--font-outfit)]"
            >
              InvestorIQ
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                  isActive
                    ? 'bg-indigo-500/12 text-indigo-300'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-indigo-400 to-cyan-400"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                <item.icon className={cn(
                  'w-[18px] h-[18px] flex-shrink-0 transition-colors',
                  isActive && 'text-indigo-400'
                )} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl bg-indigo-500/0 group-hover:bg-indigo-500/5 transition-colors pointer-events-none" />
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* AI Status */}
      <div className="p-3 border-t border-white/5">
        <div className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10',
          collapsed && 'justify-center'
        )}>
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {!collapsed && (
            <span className="text-xs text-emerald-400/80 font-medium">AI Online</span>
          )}
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="p-3 border-t border-white/5">
          <Link href="/dashboard/profile">
            <div className={cn(
              'flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer',
              collapsed && 'justify-center'
            )}>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium text-indigo-300">
                    {user.name?.[0] || user.email?.[0] || 'U'}
                  </span>
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium text-zinc-200 truncate">{user.name || 'User'}</div>
                  <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
