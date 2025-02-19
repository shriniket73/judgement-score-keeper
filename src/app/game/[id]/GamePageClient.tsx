/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/gameStore';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameStatus } from '@/components/game/GameStatus';
import { RoundInfo } from '@/components/game/RoundInfo';
import { LeaveGameDialog } from '@/components/game/LeaveGameDialog';
import { RoundHistory } from '@/components/game/RoundHistory';
import { GameComplete } from '@/components/game/GameComplete';
import { Button } from '@/components/ui/button';
import { usePreventNavigation } from '@/lib/hooks/usePreventNavigation';

interface GamePageClientProps {
  params: {
    id: string;
  };
}

export default function GamePageClient({ params }: GamePageClientProps) {
  const router = useRouter();
  const game = useGameStore(state => state.game);
  const resetGame = useGameStore(state => state.resetGame);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const isPlaying = game?.status === 'playing';

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

  const handleStartNewGame = () => {
    resetGame();
    router.replace('/game/setup');
  };

  // Main content
  return (
    <div className="h-screen overflow-auto">
      {game.status === 'completed' ? (
        <div className="container mx-auto px-4 py-8">
          <GameComplete onStartNewGame={handleStartNewGame} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-full">
            {/* Left column: Game controls and current round */}
            <div className="space-y-6">
              <GameStatus />
              <RoundInfo />
            </div>

            {/* Middle column: Scoreboard and action buttons */}
            <div className="space-y-6">
              <ScoreBoard />
              
              {/* Game action buttons */}
              {(game.status === 'round-end' || game.status === 'playing') && (
                <div className="space-y-4">
                  {game.status === 'round-end' && (
                    <div className="flex gap-4">
                      <Button 
                        onClick={() => useGameStore.getState().startNextRound()}
                        className="flex-1"
                      >
                        Start Next Round
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleLeaveGame}
                        className="flex-1 text-red-600 hover:text-red-600 hover:bg-red-50"
                      >
                        Leave Game
                      </Button>
                    </div>
                  )}
                  
                  {game.status === 'playing' && (
                    <Button 
                      variant="outline" 
                      onClick={handleLeaveGame}
                      className="w-full text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                      Leave Game
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Right column: Round History */}
            <div className="h-full">
              <RoundHistory />
            </div>
          </div>

          <LeaveGameDialog
            open={showLeaveDialog}
            onConfirm={confirmLeaveGame}
            onCancel={() => setShowLeaveDialog(false)}
          />
        </>
      )}
    </div>
  );
}