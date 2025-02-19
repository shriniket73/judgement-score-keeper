/* eslint-disable @typescript-eslint/no-unused-vars */
// components/game/RoundInfo.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useGameStore } from '@/lib/store/gameStore';
import { getRoundStatistics } from '@/lib/utils/calculations';
import { BiddingPanel } from './BiddingPanel';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTrumpForRound } from '@/lib/utils/gameLogic';

export function RoundInfo() {
  const game = useGameStore(state => state.game);
  const updateTricks = useGameStore(state => state.updateTricks);
  const completeRound = useGameStore(state => state.completeRound);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [tricks, setTricks] = useState<Record<string, number>>({});
  const suitSymbols = {
    spades: '♠',
    hearts: '♥',
    clubs: '♣',
    diamonds: '♦',
  };

  // Initialize tricks to 0 when the component mounts or game status changes
  useEffect(() => {
    if (game?.status === 'playing') {
      const currentRound = game.rounds[game.currentRound - 1];
      const initialTricks = Object.fromEntries(
        currentRound.bids.map(bid => [bid.playerId, bid.actualTricks ?? 0])
      );
      setTricks(initialTricks);
      
      // // Also update the game state
      // Object.entries(initialTricks).forEach(([playerId, tricks]) => {
      //   updateTricks(playerId, tricks);
      // });
    }
  }, [game?.status]);

  useEffect(() => {
    if (game) {
      console.log('Current game state:', {
        currentRound: game.currentRound,
        maxRounds: game.maxRounds,
        status: game.status,
        rounds: game.rounds.length
      });
    }
  }, [game]);

  if (!game) return null;

  const currentRound = game.rounds[game.currentRound - 1];
  const firstDealer = game.players.find(p => p.id === currentRound?.firstDealerId);
  const stats = currentRound ? getRoundStatistics(currentRound) : null;
  const trumpSuit = getTrumpForRound(game.currentRound);

  const sortedBids = [...currentRound.bids].sort((a, b) => 
    game.players.findIndex(p => p.id === a.playerId) - 
    game.players.findIndex(p => p.id === b.playerId)
  );

  const handleTrickInput = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    const newTricks = { ...tricks, [playerId]: numValue };
    setTricks(newTricks);
    updateTricks(playerId, numValue);
  };

  const validateAndComplete = () => {
    if (!game) return;

    console.log('Attempting to complete round:', {
      currentRound: game.currentRound,
      maxRounds: game.maxRounds,
      isLastRound: game.currentRound === game.maxRounds
    });

    // Calculate total tricks
    const totalTricks = Object.values(tricks).reduce((sum, t) => sum + (t || 0), 0);
    
    console.log('Validating tricks:', {
      totalTricks,
      cardsPerPlayer: currentRound.cardsPerPlayer,
      tricks
    });

    // All tricks are still 0
    if (totalTricks === 0) {
      setValidationMessage("Please enter tricks won by players");
      setShowValidationAlert(true);
      return;
    }

    // Total tricks exceeds cards per player
    if (totalTricks > currentRound.cardsPerPlayer) {
      setValidationMessage(`Total tricks (${totalTricks}) cannot exceed available tricks (${currentRound.cardsPerPlayer})`);
      setShowValidationAlert(true);
      return;
    }

    // Total tricks doesn't match cards per player
    if (totalTricks !== currentRound.cardsPerPlayer) {
      setValidationMessage(`Total tricks (${totalTricks}) must equal available tricks (${currentRound.cardsPerPlayer})`);
      setShowValidationAlert(true);
      return;
    }

    // All validations passed
    console.log('All validations passed, completing round');
    const result = completeRound();
    console.log('Complete round result:', result);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          {/* <span>Round {game.currentRound}</span> */}
          <div className="flex items-center space-x-2">
            <p className="text-lg font-medium">Bidding and Trick Managment</p>
            {/* <p
              className="text-2xl"
              style={{
                color: trumpSuit === 'hearts' || trumpSuit === 'diamonds' ? 'red' : 'black',
              }}
            >
              {suitSymbols[trumpSuit]}
            </p> */}
          </div>

        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* ... existing dealer and cards per player info ... */}

          {currentRound.bids.length > 0 && (
            <div>
              {/* <h4 className="text-sm font-medium mb-2">Current Round Status</h4> */}
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
                              {tricks[bid.playerId] || 0}
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={tricks[bid.playerId] || 0}
                                onChange={(e) => handleTrickInput(bid.playerId, e.target.value)}
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
                          {Object.values(tricks).reduce((sum, t) => sum + (t || 0), 0)}
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
                    onClick={validateAndComplete}
                    className="w-full"
                  >
                    Complete Round
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

      <AlertDialog open={showValidationAlert} onOpenChange={setShowValidationAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invalid Tricks Distribution</AlertDialogTitle>
            <AlertDialogDescription>
              {validationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationAlert(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}