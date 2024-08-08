import React, { useEffect } from 'react';
import { GamesTabs } from '@/widgets/GamesTabs';
import { useNavigate } from 'react-router-dom';
import { HomePageInfo } from '@/widgets/HomePageInfo';
import { ChooseGameNavigation } from '@/widgets/ChooseGameNavigation';
import { useGameCardStore, GameType, TokenType, GameResult } from '@/app/stores/gameCardStore';
import { useUserStore } from '@/app/stores/userStore'
import './HomePage.scss';
import axios from 'axios'

const HomePage: React.FC = () => {
    let userId = (localStorage.getItem('userObject')) ? JSON.parse(localStorage.getItem('userObject')).id : null;
    let name = null;
    const addActiveGame = useGameCardStore((state) => state.addActiveGame);
    const addInactiveGame = useGameCardStore((state) => state.addInactiveGame);
    const games = useGameCardStore((state) => state.activeGames);
    const removeGame = useGameCardStore((state) => state.removeActiveGame)
    const navigate = useNavigate()
    useEffect(() => {
            axios.get(`https://rockscissorpaper.xyz/api/checkgameswhereuser/${userId}`)
                .then(res => {
                    if (res.data) {
                        if (res.data.status == 'waitingForPayment') {
                            if (res.data.typeGame == 'withPlayer') {
                                navigate(`/waitingconfirm/${res.data.gameId}/${res.data.type}`)
                            }
                        } else {
                            if (res.data.typeGame == 'withPlayer') {
                                navigate(`/game/${res.data.gameId}/${res.data.type}`);
                            } else {
                                navigate(`/game/${res.data.gameId}/with-bot`);
                            }
                        }
                    }
                });
            window.Echo.channel('games').listen('.games', data => {
                if (data.createUserId != userId) {
                    addActiveGame({
                        type: 'player' as GameType,
                        gameNumber: data.number,
                        creatorUsername: data.name,
                        token: data.typePayment,
                        betSize: data.summOfBet,
                        winsNeeded: data.turns,
                    })
                }
            });
            axios.get(`https://rockscissorpaper.xyz/api/games/${userId}`).then(res => {
                res.data.data.map((game: {
                    type: GameType;
                    number: number;
                    name: string;
                    typePayment: TokenType;
                    summOfBet: number;
                    amountOfTurns: number;
                }) => (
                    addActiveGame({
                        type: 'player' as GameType,
                        gameNumber: game.number,
                        creatorUsername: game.name,
                        token: game.typePayment,
                        betSize: game.summOfBet,
                        winsNeeded: game.amountOfTurns,
                    })
                ));
            });
        window.Echo.channel('entergame').listen('.entergame', data => {
            removeGame(data.id)
        });

        window.Echo.channel('exitgame').listen('.exitgame', data => {
            console.log(games)
            removeGame(data.id)
            console.log(games)
        });
        axios.get('https://rockscissorpaper.xyz/api/lastgames').then(
            res => {
                res.data.reverse().map((game: any) => {
                    addInactiveGame({
                        type: game.enterUserId != 1 ? 'player' as GameType : 'bot' as GameType,
                        gameNumber: game.id,
                        creatorUsername: game.create_user.name,
                        token: game.typePayment,
                        betSize: game.summOfBet,
                        result: (game.winner.id !== 1) ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ' as GameResult,
                        time: game.date,
                        winnerName: game.winner.name,
                        opponentName: game.enter_user.name,
                        winsNeeded: game.maxAmountOfWins,
                    })
                }
                );
            })
    }, []);
    return (
        <div className="HomePage">
            <div>
                <HomePageInfo />
                <GamesTabs />
            </div>
            <ChooseGameNavigation />
        </div>
    );
};

export default HomePage;
