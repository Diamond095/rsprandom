import { create } from 'zustand';

interface UserState {
    username: string;
    balanceTon: number;
    balanceRandom: number;
    isWalletConnected: boolean;
    walletAddress?: string;
}

interface UserActions {
    setUsername: (username: string) => void;
    setBalanceTon: (balance: number) => void;
    setBalanceRandom: (balance: number) => void;
    setIsWalletConnected: (isConnected: boolean, address?: string) => void;
}

type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>((set) => ({
    username: '',
    balanceTon: 0,
    balanceRandom: 0,
    isWalletConnected: false,
    walletAddress: undefined,

    setUsername: (username) => set({ username }),
    setBalanceTon: (balance) => set({ balanceTon: balance }),
    setBalanceRandom: (balance) => set({ balanceRandom: balance }),
    setIsWalletConnected: (isConnected, address) =>
        set({
            isWalletConnected: isConnected,
            walletAddress: isConnected ? address : undefined,
        }),
}));
