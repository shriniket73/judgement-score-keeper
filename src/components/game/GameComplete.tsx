/* eslint-disable @typescript-eslint/no-explicit-any */
// GameComplete.tsx with improved layout and instant tooltip
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { useGameStore } from '@/lib/store/gameStore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Info } from 'lucide-react';
import { RoundHistory } from './RoundHistory';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GameCompleteProps {
  onStartNewGame: () => void;
}

export function GameComplete({ onStartNewGame }: GameCompleteProps) {
  const router = useRouter();
  const game = useGameStore(state => state.game);
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (confettiRef.current && game?.status === 'completed') {
      confettiRef.current.fire({
        particleCount: 200,
        spread: 170,
        origin: { y: 0.3, x: 0.5 },
        ticks: 300,
      });
    }
  }, [game?.status]);

  if (!game || game.status !== 'completed') return null;

  // Calculate detailed statistics for each player
  const playersWithStats = game.players.map(player => {
    const stats = game.rounds.reduce((acc, round) => {
      const bid = round.bids.find(b => b.playerId === player.id);
      if (!bid || bid.actualTricks === null) return acc;
      
      const bidSuccess = bid.actualTricks === bid.bidAmount;
      return {
        totalScore: acc.totalScore + (bidSuccess ? 10 + bid.actualTricks : 0),
        bidMatches: acc.bidMatches + (bidSuccess ? 1 : 0),
        totalRounds: acc.totalRounds + 1
      };
    }, { totalScore: 0, bidMatches: 0, totalRounds: 0 });

    return {
      ...player,
      ...stats,
      successRate: ((stats.bidMatches / stats.totalRounds) * 100).toFixed(1)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const winner = playersWithStats[0];

  // Medal components for top 3
  const medals = {
    0: <Trophy className="h-6 w-6 text-yellow-500" />,
    1: <Medal className="h-6 w-6 text-gray-400" />,
    2: <Medal className="h-6 w-6 text-amber-600" />
  };

  return (
    <div className="relative w-full">
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
      />

      {/* Main winner card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            🎉 Game Complete! 🎉
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Winner</p>
            <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              {winner.name}
              <Trophy className="h-8 w-8 text-yellow-500" />
            </h2>
            <p className="text-xl">Score: {winner.totalScore}</p>
          </div>
        </CardContent>
      </Card>

      {/* Two-column layout for leaderboard and history */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left column - Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Final Standings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Final Scoreboard */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Final Score</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          Perfect Judgement
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Number of rounds where bid exactly matched tricks won</p>
                                <p className="text-xs text-muted-foreground">(e.g., 7/8 means 7 perfect bids out of 8 rounds)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Success Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playersWithStats.map((player, index) => (
                      <TableRow key={player.id}>
                        <TableCell className="flex items-center gap-2">
                          {index < 3 ? medals[index as keyof typeof medals] : (index + 1)}
                        </TableCell>
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell className="text-right font-semibold">{player.totalScore}</TableCell>
                        <TableCell className="text-right">{player.bidMatches}/{player.totalRounds}</TableCell>
                        <TableCell className="text-right">{player.successRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Game Statistics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Rounds</p>
                  <p className="text-2xl font-semibold">{game.rounds.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Game Duration</p>
                  <p className="text-2xl font-semibold">
                    {Math.floor((new Date().getTime() - new Date(game.startTime).getTime()) / 60000)} min
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Perfect Bids</p>
                  <p className="text-2xl font-semibold">
                    {game.rounds.reduce((count, round) => 
                      count + round.bids.filter(bid => bid.actualTricks === bid.bidAmount).length
                    , 0)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={onStartNewGame}
                  className="flex-1"
                >
                  Start New Game
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column - Round History */}
        <Card>
          <CardHeader>
            <CardTitle>Round History</CardTitle>
          </CardHeader>
          <CardContent>
            <RoundHistory />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}