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
    .reverse(); // Show latest rounds first
    const suitSymbols = {
        spades: '♠',
        hearts: '♥',
        clubs: '♣',
        diamonds: '♦',
      };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Round History</CardTitle>
      </CardHeader>
      <CardContent>
        {completedRounds.length === 0 ? (
          <p className="text-muted-foreground">No completed rounds yet</p>
        ) : (
          <div className="space-y-6 max-h-[600px] overflow-y-auto relative">
            {completedRounds.map((round) => (
              <div key={round.roundNumber} className="space-y-2 relative">
                <div className="flex justify-between items-center sticky top-0 py-2 z-10 before:absolute before:inset-0 before:bg-background before:-z-10 before:border-b">
                  <h3 className="font-semibold">Round {round.roundNumber}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      Cards per player: {round.cardsPerPlayer}
                    </span>
                    {/* <span className="text-sm">
                      Trump: {getTrumpForRound(round.roundNumber)}
                    </span> */}
                    <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">Trump:</p>
                        <p
                            className="text-2xl"
                            style={{
                            color: ['hearts', 'diamonds'].includes(getTrumpForRound(round.roundNumber)) ? 'red' : 'black',
                            }}
                        >
                            {suitSymbols[getTrumpForRound(round.roundNumber)]}
                        </p>
                    </div>

                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Bid</TableHead>
                      <TableHead className="text-right">Tricks Won</TableHead>
                      <TableHead className="text-right">Points</TableHead>
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