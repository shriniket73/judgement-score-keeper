// components/game/ScoreBoard.tsx

'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useGameStore } from '@/lib/store/gameStore';
import { calculateTotalScore } from '@/lib/utils/calculations';

export function ScoreBoard() {
  const game = useGameStore(state => state.game);

  if (!game) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Score Board</h2>
        <span className="text-sm text-muted-foreground">
          Round {game.currentRound} of {game.totalRounds}
        </span>
      </div>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Current Round Trick wins</TableHead>
              <TableHead>Total Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {game.players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.name}</TableCell>
                <TableCell>
                  {game.rounds[game.currentRound - 1]?.bids.find(
                    bid => bid.playerId === player.id
                  )?.actualTricks ?? '-'}
                </TableCell>
                <TableCell className="font-medium">
                  {calculateTotalScore(player, game.rounds)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}