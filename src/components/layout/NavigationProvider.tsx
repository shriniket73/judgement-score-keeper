// src/components/layout/NavigationProvider.tsx
'use client';

import { useGameStore } from '@/lib/store/gameStore';
import { usePreventNavigation } from '@/lib/hooks/usePreventNavigation';

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const game = useGameStore(state => state.game);
  const isGameActive = game?.status !== 'completed' && game?.status !== undefined;

  // Use the prevention hook
  usePreventNavigation(isGameActive);

  return <>{children}</>;
}