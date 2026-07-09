import { Sidebar } from '@/components/dashboard/sidebar';
import { CopilotWrapper } from '@/components/copilot/copilot-wrapper';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { AuthProvider } from '@/components/auth/auth-provider';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect('/login');

  return (
    <div className="flex min-h-screen bg-[#07070a]">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto relative">
        {/* Subtle aurora gradient at top */}
        <div className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[200px] left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.03] blur-[100px]" />
          <div className="absolute -top-[200px] right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.02] blur-[100px]" />
        </div>
        {/* Animated grid */}
        <div className="absolute inset-0 grid-background-animated pointer-events-none z-0 opacity-30" />
        <AuthProvider>
          <CopilotWrapper>
            <div className="relative z-10">
              {children}
            </div>
          </CopilotWrapper>
        </AuthProvider>
      </main>
    </div>
  );
}

