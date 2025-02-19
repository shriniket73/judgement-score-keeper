// components/game/ScoreBoard.tsx
'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGameStore } from '@/lib/store/gameStore';
import { calculateTotalScore } from '@/lib/utils/calculations';
import { getMaxCardsPerRound } from '@/lib/utils/gameLogic';

export function ScoreBoard() {
  const game = useGameStore(state => state.game);

  if (!game) return null;

  const totalRounds = getMaxCardsPerRound(game.players.length);

  // Create an array of players with their scores
  const playersWithScores = game.players.map(player => ({
    ...player,
    totalScore: calculateTotalScore(player, game.rounds),
    currentRoundTricks: game.rounds[game.currentRound - 1]?.bids.find(
      bid => bid.playerId === player.id
    )?.actualTricks ?? '-'
  }));

  // Sort players by total score in descending order
  const sortedPlayers = [...playersWithScores].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Score Board</h2>
        <span className="text-sm text-muted-foreground">
          Round {game.currentRound} of {totalRounds}
        </span>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Current Round</TableHead>
              <TableHead className="text-right">Total Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">
                  {player.name}
                </TableCell>
                <TableCell className="text-right">
                  {player.currentRoundTricks}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {player.totalScore}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}