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
          
          // Validation checks
          if (!playerBid) return state;
          if (tricks < 0) return state;
          if (tricks > currentRound.cardsPerPlayer) return state;
      
          // Create new bids array with updated tricks
          const updatedBids = currentRound.bids.map(bid =>
            bid.playerId === playerId ? { ...bid, actualTricks: tricks } : bid
          );
      
          // Create new rounds array with updated round
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
        set((state: GameStore) => {
          console.log('Attempting to complete round in store:', {
            gameStatus: state.game?.status,
            currentRound: state.game?.currentRound,
            maxRounds: state.game?.maxRounds,
          });

          if (!state.game || state.game.status !== 'playing') {
            console.log('Cannot complete round:', {
              reason: !state.game ? 'No game' : 'Game not in playing status',
              status: state.game?.status
            });
            return state;
          }

          const currentRound = state.game.rounds[state.game.currentRound - 1];

          // Debug log for bids
          console.log('Current round bids:', currentRound.bids.map(bid => ({
            playerId: bid.playerId,
            actualTricks: bid.actualTricks,
          })));
          
          // Verify all tricks have been recorded
          const allTricksRecorded = currentRound.bids.every(bid => bid.actualTricks !== null);
          console.log('Tricks validation:', {
            allTricksRecorded,
            bids: currentRound.bids
          });

          if (!allTricksRecorded) {
            console.log('Not all tricks recorded');
            return state;
          }

          console.log('Individual tricks:', currentRound.bids.map(bid => ({
            playerId: bid.playerId,
            tricks: bid.actualTricks
          })));

          // Verify total tricks equals cards per player
          const totalExpectedTricks = currentRound.cardsPerPlayer;
          const totalTricks = currentRound.bids.reduce((sum, bid) => sum + (bid.actualTricks || 0), 0);
          console.log('Total tricks validation:', {
            totalTricks,
            totalExpectedTricks,
            match: totalTricks === totalExpectedTricks
          });

          if (totalTricks !== totalExpectedTricks) {
            console.log('Total tricks mismatch');
            return state;
          }

          const updatedRounds = [...state.game.rounds];
          updatedRounds[state.game.currentRound - 1].completed = true;

          const isGameComplete = state.game.currentRound === state.game.maxRounds;
          console.log('Game completion check:', {
            currentRound: state.game.currentRound,
            maxRounds: state.game.maxRounds,
            isGameComplete
          });

          success = true;
          
          const newGameState: GameState = {
            ...state.game,
            rounds: updatedRounds,
            status: isGameComplete ? 'completed' : 'round-end'
          };

          return {
            ...state,
            game: newGameState
          };
        });
        console.log('Complete round result:', success);
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