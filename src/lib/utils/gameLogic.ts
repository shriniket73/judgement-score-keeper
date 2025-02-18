/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/utils/gameLogic.ts

import { GameState, Player, Round, Suit } from '../types/game';

const TRUMP_SEQUENCE: Suit[] = ['spades', 'hearts', 'clubs', 'diamonds'];

export const getMaxCardsPerRound = (playerCount: number): number => {
  switch (playerCount) {
    case 3: return 17;
    case 4: return 13;
    case 5: return 10;
    case 6: return 8;
    default: throw new Error('Invalid player count');
  }
};

export const getTrumpForRound = (roundNumber: number): Suit => {
  return TRUMP_SEQUENCE[(roundNumber - 1) % 4];
};

export const getFirstDealerForRound = (players: Player[], previousDealerId?: string): string => {
  if (!previousDealerId) return players[0].id;
  
  const currentIndex = players.findIndex(p => p.id === previousDealerId);
  const nextIndex = (currentIndex + 1) % players.length;
  return players[nextIndex].id;
};


export const validateBid = (
  bid: number,
  cardsInRound: number,
  isLastPlayer: boolean,
  totalCurrentBids: number
): boolean => {
  // Only validate the last player rule
  if (isLastPlayer && (totalCurrentBids + bid) === cardsInRound) {
    return false; // Last player cannot make total bids equal to tricks
  }
  return true;
};


export const canCompleteRound = (round: Round): boolean => {
  return round.bids.every(bid => bid.actualTricks !== null);
};

export const validatePlayerCount = (count: number): boolean => {
  return count >= 3 && count <= 6;
};

export const getCardsForRound = (roundNumber: number, maxRounds: number): number => {
  // Handle pyramid structure
  const midPoint = Math.ceil(maxRounds / 2);
  if (roundNumber <= midPoint) {
    return roundNumber;
  }
  return maxRounds - roundNumber + 1;
};

export const validateFirstBid = (bid: number): boolean => {
  return bid !== 0; // First player can't bid 0
};

export const isGameCompleted = (currentRound: number, maxRounds: number, roundsCompleted: boolean[]): boolean => {
  return currentRound === maxRounds && roundsCompleted.every(completed => completed);
};

export const canStartNewRound = (previousRound?: Round): boolean => {
  // Can't start new round if previous round exists and isn't completed
  return !previousRound || previousRound.completed;
};

// Add bid validation for running total
export const validateRunningBidTotal = (currentBids: number[], cardsInRound: number, newBid: number): boolean => {
  const totalBids = currentBids.reduce((sum, bid) => sum + bid, 0) + newBid;
  // Total bids can't exceed cards in round
  return totalBids <= cardsInRound;
};