/* eslint-disable @typescript-eslint/no-unused-vars */
// components/game/BiddingPanel.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGameStore } from '@/lib/store/gameStore';

interface PlayerBidState {
  [playerId: string]: number;
}

export function BiddingPanel() {
  const game = useGameStore(state => state.game);
  const addBid = useGameStore(state => state.addBid);
  const [playerBids, setPlayerBids] = useState<PlayerBidState>({});
  const [error, setError] = useState<string | null>(null);

  if (!game || game.status !== 'bidding') return null;

  const currentRound = game.rounds[game.currentRound - 1];
  
  // Get players in order of bidding
  const biddingPlayers = [...game.players].sort((a, b) => {
    const firstDealerIndex = game.players.findIndex(p => p.id === currentRound.firstDealerId);
    const aIndex = (game.players.findIndex(p => p.id === a.id) - firstDealerIndex + game.players.length) % game.players.length;
    const bIndex = (game.players.findIndex(p => p.id === b.id) - firstDealerIndex + game.players.length) % game.players.length;
    return aIndex - bIndex;
  });

  const validateBids = (): string | null => {
    // Check if all players have bids
    const missingBids = biddingPlayers.filter(player => playerBids[player.id] === undefined);
    if (missingBids.length > 0) {
      return `Missing bids for: ${missingBids.map(p => p.name).join(', ')}`;
    }

    // Check for negative bids
    const negativeBids = Object.entries(playerBids).filter(([_, bid]) => bid < 0);
    if (negativeBids.length > 0) {
      return 'Bids cannot be negative';
    }

    // Check if any bid exceeds cards per player
    const invalidBids = Object.entries(playerBids).filter(([_, bid]) => bid > currentRound.cardsPerPlayer);
    if (invalidBids.length > 0) {
      return `Bids cannot exceed ${currentRound.cardsPerPlayer} tricks`;
    }

    // Only validate last player's bid restriction
    const lastPlayer = biddingPlayers[biddingPlayers.length - 1];
    const totalBidsExceptLast = biddingPlayers
      .filter(p => p.id !== lastPlayer.id)
      .reduce((sum, p) => sum + (playerBids[p.id] || 0), 0);
    
    if (totalBidsExceptLast + (playerBids[lastPlayer.id] || 0) === currentRound.cardsPerPlayer) {
      return `Last player's bid cannot make total bids (${currentRound.cardsPerPlayer}) equal to available tricks`;
    }

    return null;
  };

  const handleBidInput = (playerId: string, inputValue: string) => {
    const value = parseInt(inputValue) || 0;
    setPlayerBids(prev => ({
      ...prev,
      [playerId]: value
    }));
    setError(null);
  };

  const handleConfirmBids = () => {
    const validationError = validateBids();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Submit all bids in order
    biddingPlayers.forEach(player => {
      addBid(player.id, playerBids[player.id]);
    });
  };

  const getTotalBids = () => {
    return Object.values(playerBids).reduce((sum, bid) => sum + (bid || 0), 0);
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription className="text-sm">
            <span className="font-semibold">Invalid Bids:</span> {error}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        {biddingPlayers.map((player, index) => (
          <div key={player.id} className="flex items-center gap-4">
            <span className="w-32 font-medium">
              {player.name}
              {index === 0 && <span className="text-sm text-muted-foreground ml-1">(First Bidder)</span>}
              {index === biddingPlayers.length - 1 && 
                <span className="text-sm text-muted-foreground ml-1">(Last Bidder)</span>
              }
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={currentRound.cardsPerPlayer}
                value={playerBids[player.id] || 0}
                onChange={(e) => handleBidInput(player.id, e.target.value)}
                className="w-20"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <span className="text-sm text-muted-foreground">
          Total Bids: {getTotalBids()}/{currentRound.cardsPerPlayer}
          {getTotalBids() === currentRound.cardsPerPlayer && biddingPlayers.length > 0 && (
            <span className="text-yellow-600 ml-2">
              ⚠️ Warning: Last player&apos;s bid will make total equal to tricks
            </span>
          )}
        </span>
        <Button 
          onClick={handleConfirmBids}
          disabled={!!validateBids()}
          className="w-32"
        >
          Confirm Bids
        </Button>
      </div>
    </div>
  );
}