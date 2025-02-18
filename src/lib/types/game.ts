// lib/types/game.ts

import { ReactNode } from "react";
import { validateTotalTricks } from "../utils/calculations";

export type Suit = 'spades' | 'hearts' | 'clubs' | 'diamonds';

export type PlayerStatus = 'active' | 'inactive';

export interface Player {
  id: string;
  name: string;
  status: PlayerStatus;
  totalScore: number;
}

export interface Bid {
  playerId: string;
  roundNumber: number;
  bidAmount: number;
  actualTricks: number | null;
}

export interface Round {
  roundNumber: number;
  trumpSuit: Suit;
  cardsPerPlayer: number;
  firstDealerId: string;
  bids: Bid[];
  completed: boolean;
  trickResults?: {         // Track actual tricks won
    playerId: string;
    tricksWon: number;
  }[];
}

export interface GameState {
  totalRounds: ReactNode;
  id: string;
  players: Player[];
  currentRound: number;
  rounds: Round[];
  status: 'setup' | 'bidding' | 'playing' | 'completed' | 'round-end';
  startTime: Date;
  endTime?: Date;
  firstPlayerIndex: number;  // Track who gets dealt first
  maxRounds: number;         // Based on player count
}

// Add to types/game.ts
export const isRoundComplete = (round: Round): round is Round & { completed: true } => {
  return round.completed && 
    round.bids.every(bid => bid.actualTricks !== null) &&
    validateTotalTricks(round);
};

export const isBidValid = (bid: Bid): boolean => {
  return bid.bidAmount >= 0 && 
    (bid.actualTricks === null || bid.actualTricks >= 0);
};