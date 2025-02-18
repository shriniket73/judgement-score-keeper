// components/game/GameStatus.tsx

'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Game Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Round</p>
            <p className="text-2xl">{game.currentRound}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Trump Suit</p>
            <p className="text-2xl" style={{
              color: trumpSuit === 'hearts' || trumpSuit === 'diamonds' ? 'red' : 'black'
            }}>
              {suitSymbols[trumpSuit]}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Cards per Player</p>
            <p className="text-2xl">{currentRound?.cardsPerPlayer}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Phase</p>
            <p className="text-2xl capitalize">{game.status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}