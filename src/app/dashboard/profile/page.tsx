import { auth, signOut } from '@/auth';
import { db } from '@/db';
import { researchReports, watchlists } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Award, Brain, Target, Shield, Settings, LogOut, GitCompare, Star, Activity } from 'lucide-react';
import { MagneticButton } from '@/components/shared/magnetic-button';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  
  const userId = session.user.id as string;

  const [reports, watchlist] = await Promise.all([
    db.select().from(researchReports).where(eq(researchReports.userId, userId)),
    db.select().from(watchlists).where(eq(watchlists.userId, userId)),
  ]);

  const stats = [
    { label: 'Research Reports', value: reports.length, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Companies Watched', value: watchlist.length, icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'AI Conversations', value: Math.floor(reports.length * 1.5), icon: Brain, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Comparisons', value: Math.floor(reports.length / 2), icon: GitCompare, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 pt-12 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex items-center gap-6 z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center p-1 overflow-hidden shadow-2xl shadow-indigo-500/20">
            {session.user.image ? (
              <img src={session.user.image} alt={session.user.name || 'User'} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-violet-400">
                {session.user.name?.[0] || 'U'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)]">{session.user.name}</h1>
            <p className="text-zinc-400">{session.user.email}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> Pro Member
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
                Balanced Investor
              </span>
            </div>
          </div>
        </div>

        <form action={async () => {
          'use server';
          await signOut({ redirectTo: '/login' });
        }} className="z-10">
          <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg} mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-3xl font-bold font-[family-name:var(--font-outfit)]">{stat.value}</div>
              <div className="text-sm text-zinc-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Recent Research
          </h2>
          <div className="glass-card rounded-2xl p-4 space-y-1">
            {reports.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No research yet</div>
            ) : (
              reports.slice(0, 5).map(report => (
                <div key={report.id} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-sm">
                      {report.ticker}
                    </div>
                    <div>
                      <div className="font-medium">{report.company}</div>
                      <div className="text-xs text-zinc-500">{new Date(report.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    report.recommendation === 'INVEST' ? 'bg-emerald-500/10 text-emerald-400' :
                    report.recommendation === 'HOLD' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-rose-500/10 text-rose-400'
                  }`}>
                    {report.recommendation}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)] flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400" /> Badges & Achievements
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-2xl text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Early Adopter</div>
                <div className="text-xs text-zinc-500">Joined during Beta</div>
              </div>
            </div>
            <div className="glass-card p-4 rounded-2xl text-center flex flex-col items-center gap-2 opacity-50">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <GitCompare className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-sm">Market Analyst</div>
                <div className="text-xs text-zinc-500">10+ Comparisons (Locked)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
