/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/store/gameStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, Player, Bid, Round, Suit } from '../types/game';
import { validateBid, getMaxCardsPerRound, getTrumpForRound, getFirstDealerForRound } from '../utils/gameLogic';

interface GameStore {
  game: GameState | null;
  initializeGame: (players: Player[]) => void;
  addBid: (playerId: string, amount: number) => boolean;
  updateTricks: (playerId: string, tricks: number) => boolean;
  completeRound: () => boolean;
  startNextRound: () => void;
  resetGame: () => void;
  getPlayerScore: (playerId: string) => number;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      game: null,

      initializeGame: (players) => {
        const maxRounds = getMaxCardsPerRound(players.length);
        const firstRound: Round = {
          roundNumber: 1,
          trumpSuit: getTrumpForRound(1),
          cardsPerPlayer: 1,
          firstDealerId: players[0].id,
          bids: [],
          completed: false
        };

        const gameState: GameState = {
          id: crypto.randomUUID(),
          players,
          currentRound: 1,
          maxRounds,
          rounds: [firstRound],
          status: 'bidding',
          startTime: new Date(),
          firstPlayerIndex: 0,
          totalRounds: undefined
        };
        set({ game: gameState });
      },

      addBid: (playerId, amount) => {
        let success = false;
        set((state) => {
          if (!state.game || state.game.status !== 'bidding') return state;
          
          const currentRound = state.game.rounds[state.game.currentRound - 1];
          const totalCurrentBids = currentRound.bids.reduce((sum, bid) => sum + bid.bidAmount, 0);
          const isLastPlayer = currentRound.bids.length === state.game.players.length - 1;

          if (!validateBid(amount, currentRound.cardsPerPlayer, isLastPlayer, totalCurrentBids)) {
            return state;
          }

          const updatedRounds = [...state.game.rounds];
          const roundIndex = state.game.currentRound - 1;
          
          updatedRounds[roundIndex].bids.push({
            playerId,
            roundNumber: state.game.currentRound,
            bidAmount: amount,
            actualTricks: null
          });

          const newStatus = updatedRounds[roundIndex].bids.length === state.game.players.length 
            ? 'playing' 
            : 'bidding';

          success = true;
          return {
            game: {
              ...state.game,
              rounds: updatedRounds,
              status: newStatus
            }
          };
        });
        return success;
      },

      updateTricks: (playerId: string, tricks: number) => {
        let success = false;
        set((state) => {
          if (!state.game || state.game.status !== 'playing') return state;
      
          const currentRound = state.game.rounds[state.game.currentRound - 1];
          const playerBid = currentRound.bids.find(bid => bid.playerId === playerId);
          
          // Validation checks - only validate upper bound
          if (!playerBid) return state;
          if (tricks < 0) return state;
          if (tricks > currentRound.cardsPerPlayer) return state;
      
          const updatedBids = currentRound.bids.map(bid =>
            bid.playerId === playerId ? { ...bid, actualTricks: tricks } : bid
          );
      
          const updatedRounds = [...state.game.rounds];
          updatedRounds[state.game.currentRound - 1] = {
            ...currentRound,
            bids: updatedBids
          };
      
          success = true;
          return {
            game: {
              ...state.game,
              rounds: updatedRounds
            }
          };
        });
        return success;
      },

      completeRound: () => {
        let success = false;
        set((state) => {
          if (!state.game || state.game.status !== 'playing') return state;

          const currentRound = state.game.rounds[state.game.currentRound - 1];
          
          // Ensure all tricks have values (including 0)
          const allTricksSet = currentRound.bids.every(bid => 
            bid.actualTricks !== null && bid.actualTricks !== undefined
          );
          
          if (!allTricksSet) return state;

          // Verify total tricks equals cards per player
          const totalTricks = currentRound.bids.reduce(
            (sum, bid) => sum + (bid.actualTricks || 0), 
            0
          );
          
          if (totalTricks !== currentRound.cardsPerPlayer) return state;

          const updatedRounds = [...state.game.rounds];
          updatedRounds[state.game.currentRound - 1].completed = true;

          const isGameComplete = state.game.currentRound === state.game.maxRounds;
          
          success = true;
          
          return {
            game: {
              ...state.game,
              rounds: updatedRounds,
              status: isGameComplete ? 'completed' : 'round-end'
            }
          };
        });
        return success;
      },

      startNextRound: () => {
        set((state) => {
          if (!state.game || state.game.status !== 'round-end') return state;

          const nextRoundNumber = state.game.currentRound + 1;
          const prevRound = state.game.rounds[state.game.currentRound - 1];

          const nextRound: Round = {
            roundNumber: nextRoundNumber,
            trumpSuit: getTrumpForRound(nextRoundNumber),
            cardsPerPlayer: nextRoundNumber,
            firstDealerId: getFirstDealerForRound(state.game.players, prevRound.firstDealerId),
            bids: [],
            completed: false
          };

          return {
            game: {
              ...state.game,
              currentRound: nextRoundNumber,
              rounds: [...state.game.rounds, nextRound],
              status: 'bidding'
            }
          };
        });
      },

      resetGame: () => {
        set({ game: null });
      },

      getPlayerScore: (playerId) => {
        const state = get();
        if (!state.game) return 0;
        return state.game.rounds.reduce((total, round) => {
          const bid = round.bids.find(b => b.playerId === playerId);
          if (!bid || bid.actualTricks === null) return total;
          return total + (bid.actualTricks === bid.bidAmount ? 10 + bid.actualTricks : 0);
        }, 0);
      },
    }),
    {
      name: 'judgement-game-storage',
    }
  )
);