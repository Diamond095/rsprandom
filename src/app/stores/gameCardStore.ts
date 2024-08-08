import { create } from 'zustand';

export type GameType = 'player' | 'bot';
export type TokenType = 'ton' | 'random';
export type GameResult = 'ПОБЕДА' | 'ПОРАЖЕНИЕ';
export type GameMode = 'with-user' | 'with-bot';

interface ActiveGame {
    type: GameType;
    gameNumber: number;
    creatorUsername: string;
    token: TokenType;
    betSize: number;
    winsNeeded: number;
}

interface InactiveGame {
    type: GameType;
    gameNumber: number;
    creatorUsername: string;
    token: TokenType;
    betSize: number;
    result: GameResult;
    time: string;
    winnerName: string;
    winsNeeded: number;
    opponentName: string;
}

interface GameCardStore {
    activeGames: ActiveGame[];
    inactiveGames: InactiveGame[];
    selectedGameType: GameMode | null;
    gameBetToken: TokenType | null;
    gameBetAmount: number | null;
    winsTillEnd: number;
    errors: any,
    setGameType: (type: GameMode) => void;
    setGameBetToken: (token: TokenType) => void;
    setGameBetAmount: (amount: number | null) => void;
    setWinsTillEnd: (wins: number) => void;
    addActiveGame: (game: ActiveGame) => void;
    removeActiveGame: (gameNumber: number) => void;
    setErrors: (errors: any) => void
    moveToInactive: (
        gameNumber: number,
        result: GameResult,
        time: string,
        winnerName: string,
        opponentName: string
    ) => void;
    addInactiveGame: (game: InactiveGame) => void;
}

export const useGameCardStore = create<GameCardStore>((set) => ({
    activeGames: [],
    inactiveGames: [],
    selectedGameType: null,
    gameBetToken: null,
    gameBetAmount: null,
    winsTillEnd: 1,
    errors: [],
    setGameType: (type) => set({ selectedGameType: type }),
    setGameBetToken: (token) => set({ gameBetToken: token }),
    setGameBetAmount: (amount) => set({ gameBetAmount: amount }),
    setWinsTillEnd: (wins) => set({ winsTillEnd: wins }),
    addActiveGame: (game) => {
        set((state) => {
            if (state.activeGames.some((g) => g.gameNumber === game.gameNumber)) {
                return state;
            }
            return { activeGames: [game, ...state.activeGames] };
        });
    },
    moveToInactive: (gameNumber, result, time, winnerName, opponentName) =>
        set((state) => {
            const gameIndex = state.activeGames.findIndex((game) => game.gameNumber === gameNumber);
            if (gameIndex === -1) {
                return state;
            }
            const game = state.activeGames[gameIndex];
            const inactiveGame: InactiveGame = {
                type: game.type,
                gameNumber: game.gameNumber,
                creatorUsername: game.creatorUsername,
                token: game.token,
                betSize: game.betSize,
                result: result,
                time: time,
                winnerName: winnerName,
                winsNeeded: game.winsNeeded,
                opponentName: opponentName,
            };
            return {
                activeGames: state.activeGames.filter((_, index) => index !== gameIndex),
                inactiveGames: [inactiveGame, ...state.inactiveGames],
            };
        }),
    addInactiveGame: (game) => {
        set((state) => {
            if (state.inactiveGames.some((g) => g.gameNumber === game.gameNumber)) {
                return state;
            }
            return { inactiveGames: [game, ...state.inactiveGames] };
        });
    },
    removeActiveGame: (gameNumber) => {
        console.log('Removing active game:', gameNumber);
        set((state) => ({
            activeGames: state.activeGames.filter((game) => game.gameNumber != gameNumber),
        }));
        
    },

    setErrors: (errors) => set({ errors: errors })
}));
