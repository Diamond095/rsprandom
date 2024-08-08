import TopPartGame from '@/widgets/TopPartGame/TopPartGame';
import TurnList from '@/widgets/TurnList/TurnList';
import ChoiseTurn from '@/widgets/ChoiseTurn/ChoiseTurn';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Color, Item, TurnResult, useGameStore } from '@/app/stores/gameStore';
import { useUserStore } from '@/app/stores/userStore'
import '@/app/echo';
const GamePage: React.FC = () => {
    const id = JSON.parse(localStorage.getItem('userObject')).id;
    let { number, type } = useParams();
    const {
        resultGame,
        statusTurn,
        setStatusTurn,
        addTurn,
        setTimer,
        setIsRed,
        setResult,
        setIdTurn,
        setOpponent,
        setGameNumber,
        setType,
    } = useGameStore((state) => ({
        resultGame: state.totalResult,
        statusTurn: state.statusTurn,
        setStatusTurn: state.setStatusTurn,
        addTurn: state.addTurn,
        gameNumber: state.gameNumber,
        setTimer: state.setTimer,
        setIsRed: state.setIsRed,
        setResult: state.setTotalResult,
        setIdTurn: state.setIdTurn,
        setOpponent: state.setOpponent,
        setGameNumber: state.setGameNumber,
        turns: state.turns,
        setType: state.setType,
    }));
    const { tonBalance, randomBalance, setTonBalance, setRandomBalance } = useUserStore((state) => ({
        tonBalance: state.balanceTon,
        randomBalance: state.balanceRandom,
        setRandomBalance: state.setBalanceRandom,
        setTonBalance: state.setBalanceTon
    }))
    useEffect(() => {
        setGameNumber(number);
        setType(type);
        if (type === 'create') {
            axios.get(`https://rockscissorpaper.xyz/api/turnsforusersgame/${number}/${id}`).then((res) => {
                // setTypePayment(res.data.typePayment)
                setTimer(res.data.amountOfSecondsForTurn);
                setStatusTurn(res.data.statusTurn);
                setOpponent(res.data.opponent);
                res.data.turns.forEach((turn) => {
                    let result = null;
                    if (turn.winner === id) {
                        result = 'Победа';
                    } else if (turn.winner === null) {
                        result = 'Ничья';
                    } else {
                        result = 'Поражение';
                    }
                    if (turn.enterUserItem) {
                        addTurn({
                            createUserItem: turn.createUserItem,
                            enterUserItem: turn.enterUserItem,
                            result: result,
                        });
                    }
                });
                if (res.data.result) {
                    setResult(res.data.result);
                }
            });
            window.Echo.channel(`enteruserturn${number}`).listen(
                '.enteruserturn',
                (data: any) => {
                    setStatusTurn(true);
                    setTimer(60);
                    setIsRed(false);
                    addTurn({
                        createUserItem: data.createUserItem,
                        enterUserItem: data.enterUserItem,
                        result: data.turnResult,
                    });
                    if (data.result) {
                        setResult(data.result);
                        if (data.result == 'ПОРАЖЕНИЕ') {
                            if (data.typePayment == 'ton') {
                                setTonBalance(tonBalance - data.summOfBet);
                            } else {
                                setRandomBalance(randomBalance - data.summOfBet);
                            }
                        } else {
                            if (data.typePayment == 'ton') {
                                setTonBalance(tonBalance + 0.95*data.summOfBet);
                            } else {
                                setRandomBalance(randomBalance + 0.95*data.summOfBet);
                            }
                        }
                    }
                }
            );
        } else if (type == 'enter') {
            axios.get(`https://rockscissorpaper.xyz/api/turnsforusersgame/${number}/${id}`).then((res) => {
                setIdTurn(res.data.lastTurnId);
                setTimer(res.data.amountOfSecondsForTurn);
                if (type == 'enter') {
                    setIdTurn(res.data.lastTurnId);
                }
                setStatusTurn(res.data.statusTurn);
                setOpponent(res.data.opponent);
                res.data.turns.forEach((turn) => {
                    let result = null;
                    if (turn.winner === id) {
                        result = 'Победа';
                    } else if (turn.winner === null) {
                        result = 'Ничья';
                    } else {
                        result = 'Поражение';
                    }
                    if (turn.enterUserItem) {
                        addTurn({
                            createUserItem: turn.createUserItem,
                            enterUserItem: turn.enterUserItem,
                            result: result,
                        });
                    }
                });
                if (res.data.result) {
                    setResult(res.data.result);
                }
            });
            window.Echo.channel(`createuserturn${number}`).listen('.createuserturn', (data) => {
                setIdTurn(data.id);
                setStatusTurn(true);
                setTimer(60);
                setIsRed(false);
                
            });
        } else {
            axios.get(`https://rockscissorpaper.xyz/api/turns/${number}/${id}`).then((res) => {
                setTimer(res.data.amountOfSecondsForTurn);
                setOpponent('Bot');
                res.data.turns.forEach(
                    (turn: { createUserItem: Item; enterUserItem: Item | null; winner: number | null }) => {
                        let result = null;
                        if (turn.winner === id) {
                            result = 'Победа';
                        } else if (turn.winner === null) {
                            result = 'Ничья';
                        } else {
                            result = 'Поражение';
                        }
                        if (turn.enterUserItem) {
                            addTurn({
                                createUserItem: turn.createUserItem,
                                enterUserItem: turn.enterUserItem,
                                result: result,
                            });
                        }
                    }
                );
                if (res.data.result) {
                    setResult(res.data.result);
                }
            });
        }
        window.Echo.channel(`timerend${number}`).listen('.timerend', (data) => {
            setResult(data.winner === id ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
            
        });
    }, []);
    return (
        <div>
            <TopPartGame></TopPartGame>
            <TurnList></TurnList>
            <ChoiseTurn></ChoiseTurn>
        </div>
    );
};

export default GamePage;
