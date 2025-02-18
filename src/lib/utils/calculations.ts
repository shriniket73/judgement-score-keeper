// lib/utils/calculations.ts

import { Bid, Round, Player, GameState } from '../types/game';

export const calculateRoundScore = (bid: Bid): number => {
  if (bid.actualTricks === null) return 0;
  if (bid.actualTricks === bid.bidAmount) {
    return 10 + bid.actualTricks;
  }
  return 0;
};

export const calculateTotalScore = (player: Player, rounds: Round[]): number => {
  return rounds.reduce((total, round) => {
    const playerBid = round.bids.find(bid => bid.playerId === player.id);
    if (!playerBid) return total;
    return total + calculateRoundScore(playerBid);
  }, 0);
};

export const getLeaderboard = (players: Player[], rounds: Round[]): Player[] => {
  return [...players]
    .map(player => ({
      ...player,
      totalScore: calculateTotalScore(player, rounds)
    }))
    .sort((a, b) => b.totalScore - a.totalScore);
};

export const getRoundStatistics = (round: Round) => {
  const totalBids = round.bids.reduce((sum, bid) => sum + bid.bidAmount, 0);
  const totalTricks = round.bids.reduce((sum, bid) => sum + (bid.actualTricks || 0), 0);
  
  return {
    totalBids,
    totalTricks,
    overbid: totalBids > round.cardsPerPlayer,
    underbid: totalBids < round.cardsPerPlayer
  };
};

export const validateTrickCount = (tricks: number, cardsPerRound: number): boolean => {
  return tricks >= 0 && tricks <= cardsPerRound;
};

export const validateTotalTricks = (round: Round): boolean => {
  const totalTricks = round.bids.reduce((sum, bid) => 
    sum + (bid.actualTricks || 0), 0);
  return totalTricks === round.cardsPerPlayer;
};

// Add to calculations.ts
export const validateRoundScores = (round: Round): boolean => {
  if (!round.completed) return false;
  
  // Verify all players have recorded tricks
  const allTricksRecorded = round.bids.every(bid => bid.actualTricks !== null);
  if (!allTricksRecorded) return false;

  // Sum of tricks should equal cards per player
  const totalTricks = round.bids.reduce((sum, bid) => sum + (bid.actualTricks || 0), 0);
  return totalTricks === round.cardsPerPlayer;
};

export const getRoundWinner = (round: Round, players: Player[]): Player | null => {
  if (!round.completed) return null;
  
  const playerScores = round.bids.map(bid => ({
    player: players.find(p => p.id === bid.playerId)!,
    score: calculateRoundScore(bid)
  }));
  
  // If no scores, return null
  if (playerScores.length === 0) return null;

  // Fixed version with proper typing
  return playerScores.reduce((highest, current) => 
    current.score > highest.score ? current : highest
  , playerScores[0]).player;
};

// Add to calculations.ts
export const getPlayerStatistics = (player: Player, rounds: Round[]) => {
  const playerBids = rounds.flatMap(round => 
    round.bids.filter(bid => bid.playerId === player.id)
  );
  
  return {
    totalBids: playerBids.reduce((sum, bid) => sum + bid.bidAmount, 0),
    successfulBids: playerBids.filter(bid => bid.actualTricks === bid.bidAmount).length,
    averageScore: playerBids.reduce((sum, bid) => sum + calculateRoundScore(bid), 0) / playerBids.length,
    perfectRounds: playerBids.filter(bid => calculateRoundScore(bid) > 0).length
  };
};

export const getGameStatistics = (game: GameState) => {
  const completedRounds = game.rounds.filter(r => r.completed);
  
  return {
    roundsPlayed: completedRounds.length,
    roundsRemaining: game.maxRounds - game.currentRound,
    highestScoringRound: completedRounds.reduce((highest, round) => {
      const roundScore = round.bids.reduce((sum, bid) => sum + calculateRoundScore(bid), 0);
      return roundScore > highest.score ? { round: round.roundNumber, score: roundScore } : highest;
    }, { round: 0, score: 0 }),
    leaderboard: getLeaderboard(game.players, game.rounds)
  };
};