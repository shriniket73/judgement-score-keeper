// components/game/RoundInfo.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGameStore } from '@/lib/store/gameStore';
import { getRoundStatistics } from '@/lib/utils/calculations';
import { BiddingPanel } from './BiddingPanel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTrumpForRound } from '@/lib/utils/gameLogic';

export function RoundInfo() {
  const game = useGameStore(state => state.game);
  const updateTricks = useGameStore(state => state.updateTricks);
  const completeRound = useGameStore(state => state.completeRound);
  const [error, setError] = useState<string>('');
  const [initialized, setInitialized] = useState(false);

  const initializeTricks = useCallback(() => {
    if (!game || game.status !== 'playing' || initialized) return;
  
    const currentRound = game.rounds[game.currentRound - 1];
    if (!currentRound) return;
  
    // Always initialize all tricks to 0
    currentRound.bids.forEach(bid => {
      updateTricks(bid.playerId, 0);
    });
    setInitialized(true);
  }, [game, updateTricks, initialized]);

  // Initialize tricks when entering playing state
  useEffect(() => {
    if (game?.status === 'playing' && !initialized) {
      initializeTricks();
    }
  }, [game?.status, initialized, initializeTricks]);

  if (!game) return null;

  const currentRound = game.rounds[game.currentRound - 1];
  const firstDealer = game.players.find(p => p.id === currentRound?.firstDealerId);
  const stats = currentRound ? getRoundStatistics(currentRound) : null;
  const trump = getTrumpForRound(game.currentRound);

  const sortedBids = [...currentRound.bids].sort((a, b) => 
    game.players.findIndex(p => p.id === a.playerId) - 
    game.players.findIndex(p => p.id === b.playerId)
  );

  const checkAllTricksAreZero = (): boolean => {
    return sortedBids.every(bid => !bid.actualTricks);
  };
  

  const validateTricksTotal = (): boolean => {
    if (!currentRound) return false;
    
    // Calculate total tricks
    const totalTricks = sortedBids.reduce((sum, bid) => sum + (bid.actualTricks || 0), 0);
    
    // Check if all tricks are still 0 (invalid state)
    if (checkAllTricksAreZero()) {
      return false;
    }
    
    // Check if total tricks equals cards per player
    return totalTricks === currentRound.cardsPerPlayer;
  };

  const handleUpdateTricks = (playerId: string, inputValue: string) => {
    const value = parseInt(inputValue) || 0;
    if (value < 0) {
      setError('Tricks cannot be negative');
      return;
    }

    // Calculate total tricks excluding this player
    const totalOtherTricks = sortedBids.reduce((sum, bid) => {
      if (bid.playerId === playerId) return sum;
      return sum + (bid.actualTricks || 0);
    }, 0);

    if (totalOtherTricks + value > currentRound.cardsPerPlayer) {
      setError(`Total tricks cannot exceed ${currentRound.cardsPerPlayer}`);
      return;
    }

    setError('');
    updateTricks(playerId, value);
  };

  const handleCompleteRound = () => {
    if (validateTricksTotal()) {
      completeRound();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Round {game.currentRound}</span>
          <span className="text-muted-foreground">Trump: {trump}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">First Dealer/Bidder</p>
              <p className="text-lg">{firstDealer?.name || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cards per Player</p>
              <p className="text-lg">{currentRound.cardsPerPlayer}</p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentRound.bids.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Current Round Status</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Bid</TableHead>
                    {game.status === 'playing' && (
                      <>
                        <TableHead className="text-right">Tricks</TableHead>
                        <TableHead className="text-right w-32">Input Tricks</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedBids.map((bid) => {
                    const player = game.players.find(p => p.id === bid.playerId);
                    return (
                      <TableRow key={bid.playerId}>
                        <TableCell>{player?.name}</TableCell>
                        <TableCell className="text-right">{bid.bidAmount}</TableCell>
                        {game.status === 'playing' && (
                          <>
                            <TableCell className="text-right">
                              {bid.actualTricks !== null ? bid.actualTricks : '0'}
                            </TableCell>
                            <TableCell>
                            <Input
                              type="number"
                              value={bid.actualTricks ?? 0}  // Use nullish coalescing
                              onChange={(e) => handleUpdateTricks(bid.playerId, e.target.value)}
                              onBlur={(e) => {
                                if (e.target.value === '' || isNaN(parseInt(e.target.value))) {
                                  handleUpdateTricks(bid.playerId, '0');
                                }
                              }}
                              min={0}
                              max={currentRound.cardsPerPlayer}
                              className="w-20 ml-auto"
                            />
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell className="font-medium">Total</TableCell>
                    <TableCell className="text-right font-medium">
                      {stats?.totalBids}
                    </TableCell>
                    {game.status === 'playing' && (
                      <>
                        <TableCell className="text-right font-medium">
                          {stats?.totalTricks || 0}
                        </TableCell>
                        <TableCell />
                      </>
                    )}
                  </TableRow>
                </TableBody>
              </Table>

              {game.status === 'playing' && (
                <div className="mt-4">
                  <Button 
                    onClick={handleCompleteRound}
                    disabled={!!error || !validateTricksTotal()}
                    className="w-full"
                  >
                    {!!error 
                      ? error 
                      : checkAllTricksAreZero()
                        ? "Enter tricks won by players"
                        : !validateTricksTotal()
                          ? `Total tricks must equal ${currentRound.cardsPerPlayer}`
                          : "Complete Round"
                    }
                  </Button>
                </div>
              )}
            </div>
          )}

          {game.status === 'bidding' && (
            <div className="mt-6">
              <BiddingPanel />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}