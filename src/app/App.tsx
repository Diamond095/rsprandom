import React, { useEffect, useRef } from 'react';
import { RouterProvider } from './providers/RouterProvider';
import { Header } from '@/widgets/Header';
import { useUserStore } from '@/app/stores/userStore';
import { useGameCardStore, GameType, TokenType, GameResult } from '@/app/stores/gameCardStore';
import '@/app/styles/main.scss';
import '@/app/echo'
import { TonConnectProvider } from './providers/TonConnectProvider';
import Initializer from './initializer';
const App: React.FC = () => {
    const setUsername = useUserStore((state) => state.setUsername);
    const setBalanceTon = useUserStore((state) => state.setBalanceTon);
    const setBalanceRandom = useUserStore((state) => state.setBalanceRandom);

    const addActiveGame = useGameCardStore((state) => state.addActiveGame);
    const addInactiveGame = useGameCardStore((state) => state.addInactiveGame);

    const initialized = useRef(false);

    return (
        <TonConnectProvider>
            <Initializer />
            <RouterProvider>
                <Header />
            </RouterProvider>
        </TonConnectProvider>
    );
};

export default App;
