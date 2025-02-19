// components/game/GameStatus.tsx
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { useGameStore } from '@/lib/store/gameStore';
import { getTrumpForRound } from '@/lib/utils/gameLogic';

const suitSymbols = {
  spades: '♠',
  hearts: '♥',
  clubs: '♣',
  diamonds: '♦',
};

export function GameStatus() {
  const game = useGameStore(state => state.game);

  if (!game) return null;

  const currentRound = game.rounds[game.currentRound - 1];
  const trumpSuit = getTrumpForRound(game.currentRound);

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          {/* Left side info */}
          <div className="flex items-center gap-6">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">Round</span>
              <span className="text-lg font-semibold">{game.currentRound}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">Cards per player</span>
              <span className="text-lg font-semibold">{currentRound?.cardsPerPlayer}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-muted-foreground">Trump</span>
              <span 
                className="text-lg font-semibold"
                style={{
                  color: trumpSuit === 'hearts' || trumpSuit === 'diamonds' ? 'red' : 'black'
                }}
              >
                {suitSymbols[trumpSuit]}
              </span>
            </div>
          </div>

          {/* Right side - Phase */}
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-muted-foreground">Phase</span>
            <span className="text-lg font-semibold capitalize">{game.status.replace('-', ' ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}