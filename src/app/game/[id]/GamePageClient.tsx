'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/gameStore';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameStatus } from '@/components/game/GameStatus';
import { RoundInfo } from '@/components/game/RoundInfo';
import { LeaveGameDialog } from '@/components/game/LeaveGameDialog';
import { RoundHistory } from '@/components/game/RoundHistory';
import { Button } from '@/components/ui/button';
import { usePreventNavigation } from '@/lib/hooks/usePreventNavigation';

type GamePageClientProps = {
    params: {
      id: string;
    };
  };

export default function GamePageClient({ params }: GamePageClientProps) {
  const router = useRouter();
  const game = useGameStore(state => state.game);
  const resetGame = useGameStore(state => state.resetGame);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const isPlaying = game?.status === 'playing';

  // Prevent navigation when game is in progress
  usePreventNavigation(isPlaying);


  useEffect(() => {
    if (!game) {
      router.replace('/');
      return;
    }

    if (game.id !== params.id) {
      router.replace(`/game/${game.id}`);
      return;
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (game && game.status !== 'completed') {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [game, params.id, router]);

  if (!game) {
    return null;
  }

  const handleLeaveGame = () => {
    setShowLeaveDialog(true);
  };

  const confirmLeaveGame = () => {
    resetGame();
    router.replace('/');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Game controls and current round */}
        <div className="space-y-6">
          <GameStatus />
          <RoundInfo />
          {game.status === 'round-end' && (
            <Button onClick={() => useGameStore.getState().startNextRound()}>
              Start Next Round
            </Button>
          )}
          {game.status !== 'completed' && (
            <Button variant="outline" onClick={handleLeaveGame}>
              Leave Game
            </Button>
          )}
        </div>

        {/* Middle column: Scoreboard */}
        <div>
          <ScoreBoard />
        </div>

        {/* Right column: Round History */}
        <div>
          <RoundHistory />
        </div>
      </div>

      <LeaveGameDialog
        open={showLeaveDialog}
        onConfirm={confirmLeaveGame}
        onCancel={() => setShowLeaveDialog(false)}
      />
    </main>
  );
}