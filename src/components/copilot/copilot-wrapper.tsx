'use client';

// ============================================
// Copilot Wrapper — Client Component Bridge
// ============================================
// This wraps the dashboard children with the CopilotProvider
// and renders the floating orb + panel. Keeps the layout
// as a Server Component for performance.

import { CopilotProvider } from '@/components/copilot/copilot-provider';
import { CopilotOrb } from '@/components/copilot/copilot-orb';
import { CopilotPanel } from '@/components/copilot/copilot-panel';

export function CopilotWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CopilotProvider>
      {children}
      <CopilotOrb />
      <CopilotPanel />
    </CopilotProvider>
  );
}
