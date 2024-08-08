import { create } from 'zustand';
// Типы данных для игры
export type TurnType = 'enter' | 'create' | 'with-bot';
export type Item = 'rock' | 'paper' | 'scissor';
export type TurnResult = 'Победа' | 'Поражение' | 'Ничья';
export type Color = 'linear-gradient(to left, #46891D, #26D822, #46891D)' | 'linear-gradient(to left, #6C0921, #E21B33, #6C0921)' | 'linear-gradient(to left, #212B3E, #394E76, #212B3E)';

interface Turn {
    enterUserItem: Item,
    createUserItem: Item,
    result: TurnResult,
    backgroudColor: Color
}
interface GameStore {
    turns: Turn[],
    totalResult: string | null,
    statusTurn: boolean,
    type: string | null,
    timer: number,
    isRed: boolean,
    opponent: string | null,
    gameNumber: number | null,
    idTurn: number | null, 
    statusRequestCompletion: boolean, 
    typePayment: string | null, 
    addTurn: (turn: {
        turnNumber: number,
        enterUserItem: Item,
        createUserItem: Item,
        result: TurnResult,
    }) => void,
    setTypePayment: (type: string) => void, 
    setTotalResult: (result: string) => void,
    setStatusTurn: (statusTurn: boolean) => void,
    setType: (type: string) => void,
    setTimer: (timer: number) => void,
    setIsRed: (red: boolean) => void,
    setOpponent: (opponent: string) => void,
    setGameNumber: (gameNumber: number) => void,
    setIdTurn: (idTurn: number) => void,
    setStatusRequestCompletion: (statusRequestCompletion: boolean) => void,
    reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
    turns: [],
    totalResult: null,
    statusTurn: false,
    type: null,
    timer: 60,
    isRed: false,
    opponent: null,
    gameNumber: null,
    idTurn: null, 
    typePayment: null, 
    statusRequestCompletion: false,
    setTypePayment: (type) => set({typePayment:type}),
    setStatusRequestCompletion: (statusRequestCompletion) => set({statusRequestCompletion: statusRequestCompletion}),
    setIdTurn: (idTurn) => set({idTurn:idTurn}),
    setGameNumber: (gameNumber) => set({ gameNumber: gameNumber }),
    setOpponent: (opponent) => set({ opponent: opponent }),
    setType: (type) => set({ type: type }),
    setTotalResult: (result) => set({ totalResult: result }),
    setStatusTurn: (statusTurn) => set({ statusTurn: statusTurn }),
    setTimer: (timer) => set({ timer: timer }),
    setIsRed: (red) => set({ isRed: red }),
    reset: () => set({
        turns: [],
        totalResult: null,
        statusTurn: false,
        type: null,
        timer: 60,
        isRed: false,
        opponent: null,
        gameNumber: null,
        idTurn: null,
        typePayment: null,
        statusRequestCompletion: false,
    }),
    addTurn: (turn) =>{
        set((state) => {
            let backgroudColor: Color;
            if (turn.result === 'Победа') {
                backgroudColor = 'linear-gradient(to left, #46891D, #26D822, #46891D)';
            } else if (turn.result === 'Поражение') {
                backgroudColor = 'linear-gradient(to left, #6C0921, #E21B33, #6C0921)';
            } else {
                backgroudColor = 'linear-gradient(to left, #212B3E, #394E76, #212B3E)'
            }
            const newTurn = {
                backgroudColor: backgroudColor,
                result: turn.result,
                createUserItem: turn.createUserItem,
                enterUserItem: turn.enterUserItem,
            }
            return { turns: [newTurn, ...state.turns] };
        });
    }
}));
