import { create } from 'zustand';

interface DepositState {
    amount: number | null;
    token: string;
    setDeposit: (amount: number, token: string) => void;
}

const useDepositStore = create<DepositState>((set) => ({
    amount: null,
    token: '',
    setDeposit: (amount, token) => set({ amount, token }),
}));

export default useDepositStore;
