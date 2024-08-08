import React, { useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useUserStore } from '@/app/stores/userStore';
import { useGameCardStore, GameType, TokenType, GameResult } from '@/app/stores/gameCardStore';
import axios from 'axios';

const Initializer: React.FC = () => {
    const userFriendlyAddress = useTonAddress();

    const setUsername = useUserStore((state) => state.setUsername);
    const setBalanceTon = useUserStore((state) => state.setBalanceTon);
    const setBalanceRandom = useUserStore((state) => state.setBalanceRandom);
    const setIsWalletConnected = useUserStore((state) => state.setIsWalletConnected);

    const addActiveGame = useGameCardStore((state) => state.addActiveGame);
    const addInactiveGame = useGameCardStore((state) => state.addInactiveGame);

    const formatTime = (time: string) => {
        const date = new Date(time);
        const day = date.getDate();
        const month = date.toLocaleString('ru-RU', { month: 'long' });
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${hours}:${minutes}`;
    };

    useEffect(() => {
        let name = null;
        if(!localStorage.getItem('userObject')) {
            if (window.Telegram.WebApp.initDataUnsafe.user.username) {
                name = window.Telegram.WebApp.initDataUnsafe.user.username
            } else {
                if (window.Telegram.WebApp.initDataUnsafe.user.first_name && window.Telegram.WebApp.initDataUnsafe.user.last_name) {
                    name = window.Telegram.WebApp.initDataUnsafe.user.first_name + ' ' + window.Telegram.WebApp.initDataUnsafe.user.last_name
                } else {
                    name = window.Telegram.WebApp.initDataUnsafe.user.first_name
                }
            }
            const secondId = window.Telegram.WebApp.initDataUnsafe.user.id;
            axios.get(`https://rockscissorpaper.xyz/api/user/${name}/${secondId}`)
                .then(response => {
                    localStorage.setItem('userObject', JSON.stringify({
                        name: response.data.user.name,
                        id: response.data.user.id,
                        secondId: response.data.user.telegramId
                    }))
                })
            }
        if (userFriendlyAddress) {
            console.log('Connected wallet address:', userFriendlyAddress);

            const username = 'User123';
            const id = JSON.parse(localStorage.getItem('userObject')).id
            axios.get(`https://rockscissorpaper.xyz/api/balance/${id}`)
                .then(res => {
                    setBalanceRandom(res.data.random_balance)
                    setBalanceTon(res.data.ton_balance)
                })

            setUsername(username);
            setIsWalletConnected(true, userFriendlyAddress);
        } else {
            setBalanceTon(0);
            setBalanceRandom(0);
            setIsWalletConnected(false);
        }

    }, [
        userFriendlyAddress,
        setBalanceTon,
        setBalanceRandom,
        setUsername,
        setIsWalletConnected,
        addActiveGame,
        addInactiveGame,
    ]);

    return null;
};

export default Initializer;
