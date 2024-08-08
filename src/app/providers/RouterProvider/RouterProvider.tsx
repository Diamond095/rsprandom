import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import DepositPage from '@/pages/DepositPage';
import GamePage from '@/pages/GamePage';
import WaitingGamePage from '@/pages/WaitingGamePage';
import WalletPage from '@/pages/WalletPage';
import WithdrawPage from '@/pages/WithdrawPage';
import CreateGame from '@/pages/CreateGame';
import WaitingConfirmingPage from '@/pages/WaitingConfirming'
interface RouterProviderProps {
    children?: React.ReactNode;
}

const RouterProvider: React.FC<RouterProviderProps> = ({ children }) => {
    return (
        <Router>
            {children}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/deposit/:token" element={<DepositPage />} />
                <Route path="/creategame/:type" element={<CreateGame />} />
                <Route path="/game/:number/:type" element={<GamePage />} />
                <Route path="/waiting/:number" element={<WaitingGamePage />} />
                <Route path="/waitingconfirm/:number/:type" element={<WaitingConfirmingPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/withdraw/:token" element={<WithdrawPage />} />
            </Routes>
        </Router>
    );
};

export default RouterProvider;
