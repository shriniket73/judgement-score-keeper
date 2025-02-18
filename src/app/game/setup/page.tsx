/* eslint-disable @typescript-eslint/no-unused-vars */
// app/game/setup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlayerSetup } from '@/components/game/PlayerSetup';
import { useGameStore } from '@/lib/store/gameStore';
import { Player } from '@/lib/types/game';

export default function GameSetup() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number>(3);
  const initializeGame = useGameStore(state => state.initializeGame);

  const handleStartGame = (players: Player[]) => {
    initializeGame(players);
    router.push(`/game/${players[0].id}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Game Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-lg font-medium">Number of Players</label>
              <RadioGroup
                defaultValue={playerCount.toString()}
                onValueChange={(value) => setPlayerCount(Number(value))}
                className="flex gap-6"
              >
                {[3, 4, 5, 6].map(num => (
                  <div key={num} className="flex items-center space-x-2">
                    <RadioGroupItem value={num.toString()} id={`players-${num}`} />
                    <Label htmlFor={`players-${num}`} className="text-base">
                      {num} Players
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <PlayerSetup 
              playerCount={playerCount} 
              onComplete={handleStartGame}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}