/* eslint-disable @typescript-eslint/no-unused-vars */
// components/game/PlayerSetup.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Player } from '@/lib/types/game';

interface PlayerSetupProps {
  playerCount: number;
  onComplete: (players: Player[]) => void;
}

export function PlayerSetup({ playerCount, onComplete }: PlayerSetupProps) {
  const [players, setPlayers] = useState<Array<{ name: string }>>([]);
  const [errors, setErrors] = useState<Array<string>>([]);

  // Update players array when playerCount changes
  useEffect(() => {
    setPlayers(prevPlayers => 
      [...Array(playerCount)].map((_, i) => ({ 
        name: prevPlayers[i]?.name || '' 
      }))
    );
    setErrors(new Array(playerCount).fill(''));
  }, [playerCount]); // Now using functional update for players

  const handleNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    const newErrors = [...errors];
    
    // Validate name
    if (!name.trim()) {
      newErrors[index] = 'Name is required';
    } else if (players.some((player, i) => i !== index && player.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      newErrors[index] = 'Name must be unique';
    } else {
      newErrors[index] = '';
    }
    
    newPlayers[index].name = name;
    setPlayers(newPlayers);
    setErrors(newErrors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPlayers = players.map((player, index) => ({
      id: crypto.randomUUID(),
      name: player.name.trim(),
      status: 'active' as const,
      totalScore: 0
    }));
    onComplete(formattedPlayers);
  };

  // Check if all players have valid names
  const isValid = players.every((player) => player.name.trim()) && 
                 errors.every((error) => !error) &&
                 players.length === playerCount;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {players.map((player, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={`Player ${index + 1} name`}
              value={player.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className={errors[index] ? 'border-red-500' : ''}
            />
          </div>
          {errors[index] && (
            <p className="text-sm text-red-500">{errors[index]}</p>
          )}
        </div>
      ))}
      <Button 
        type="submit"
        disabled={!isValid}
        className="w-full"
      >
        Start Game
      </Button>
      {!isValid && players.some(p => p.name.trim()) && (
        <p className="text-sm text-amber-500 text-center">
          Please enter names for all players to start the game
        </p>
      )}
    </form>
  );
}