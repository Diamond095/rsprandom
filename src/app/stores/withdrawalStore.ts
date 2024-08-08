import { create } from 'zustand';

interface WithdrawalState {
    amount: number | null;
    token: string;
    setWithdrawal: (amount: number, token: string) => void;
}

const useWithdrawalStore = create<WithdrawalState>((set) => ({
    amount: null,
    token: '',
    setWithdrawal: (amount, token) => set({ amount, token }),
}));

export default useWithdrawalStore;
