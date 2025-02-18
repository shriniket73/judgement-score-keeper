// components/game/RoundHistory.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from '@/lib/store/gameStore';
import { getTrumpForRound } from '@/lib/utils/gameLogic';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RoundHistory() {
  const game = useGameStore(state => state.game);

  if (!game) return null;

  const completedRounds = [...game.rounds]
  .filter(round => round.completed)
  .reverse(); // Reverse the array to show latest first

  return (
    <Card>
      <CardHeader>
        <CardTitle>Round History</CardTitle>
      </CardHeader>
      <CardContent>
        {completedRounds.length === 0 ? (
          <p className="text-muted-foreground">No completed rounds yet</p>
        ) : (
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {completedRounds.map((round) => (
              <div key={round.roundNumber} className="space-y-2">
                <div className="flex justify-between items-center sticky top-0 bg-background py-2">
                  <h3 className="font-semibold">Round {round.roundNumber}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      Cards per player: {round.cardsPerPlayer}
                    </span>
                    <span className="text-sm">
                      Trump: {getTrumpForRound(round.roundNumber)}
                    </span>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Bid</TableHead>
                      <TableHead className="text-right">Tricks Won</TableHead>
                      <TableHead className="text-right">Round Points</TableHead>
                      <TableHead className="text-right">Running Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {round.bids.map((bid) => {
                      const player = game.players.find(p => p.id === bid.playerId);
                      const playerPoints = bid.actualTricks === bid.bidAmount 
                        ? 10 + bid.actualTricks 
                        : 0;
                      const runningTotal = game.rounds
                        .filter(r => r.roundNumber <= round.roundNumber)
                        .reduce((total, r) => {
                          const playerBid = r.bids.find(b => b.playerId === bid.playerId);
                          if (!playerBid) return total;
                          return total + (playerBid.actualTricks === playerBid.bidAmount 
                            ? 10 + playerBid.actualTricks 
                            : 0);
                        }, 0);

                      return (
                        <TableRow key={bid.playerId}>
                          <TableCell>{player?.name}</TableCell>
                          <TableCell className="text-right">{bid.bidAmount}</TableCell>
                          <TableCell className="text-right">
                            {bid.actualTricks !== null ? bid.actualTricks : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {playerPoints}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {runningTotal}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>

                <div className="flex justify-between text-sm text-muted-foreground pt-2">
                  <span>
                    Total Bids: {round.bids.reduce((sum, bid) => sum + bid.bidAmount, 0)}
                  </span>
                  <span>
                    Total Tricks: {round.bids.reduce((sum, bid) => sum + (bid.actualTricks || 0), 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}