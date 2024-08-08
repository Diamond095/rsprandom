import React, { useEffect, useState } from 'react';
import { useGameCardStore } from '@/app/stores/gameCardStore';
import { useGameStore } from '@/app/stores/gameStore';
import './WaitingGamePage.scss';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WaitingConfirmingPage: React.FC = () => {
    const navigate = useNavigate()
    const { selectedGameType, gameBetToken, gameBetAmount, winsTillEnd } = useGameCardStore((state) => ({
        selectedGameType: state.selectedGameType,
        gameBetToken: state.gameBetToken,
        gameBetAmount: state.gameBetAmount,
        winsTillEnd: state.winsTillEnd,
    }));
    let { number, type } = useParams()
    const { opponent, setOpponent, gameNumber } = useGameStore((state) => ({
        opponent: state.opponent,
        setOpponent: state.setOpponent,
        gameNumber: state.gameNumber,
    }));

    const isGameDataAvailable = selectedGameType && gameBetToken && gameBetAmount !== null && winsTillEnd !== null;
    const [waitingStatus, setWaitingStatus] = useState<string>('Игра создается...');
    const [countdown, setCountdown] = useState<number>(60);
    const [token, setToken] = useState(null)
    const [statusConfirm, setStatusConfirm] = useState(false)
    useEffect(() => {
        let countdownInterval: NodeJS.Timeout;
        axios.post('https://rockscissorpaper.xyz/api/readyinfo', {
            gameId: number
        }).then(res=>{
            setCountdown(res.data.amountOfTime)
            setToken(res.data.token);
            if(res.data.status == 0){
            setStatusConfirm(false)
            } else{ 
                setStatusConfirm(true)
            }
        })
        if (!opponent) {
            setWaitingStatus('Игра создана, ожидание игрока...');
            countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown <= 1) {
                        clearInterval(countdownInterval);
                        setOpponent('OpponentUsername');
                        return 0;
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        } else {
            setWaitingStatus(`Противник найден - подтверждение оплаты (токен ${gameBetToken})`);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [selectedGameType, opponent, gameBetToken, setOpponent]);

    useEffect(() => {
            window.Echo.channel(`redirecttogame${number}`).listen('.redirecttogame', data => {
                navigate(`/game/${number}/${type}`);
            });
            window.Echo.channel(`timerready${number}`).listen('.timerready', data => {
                navigate('/');
            });
        if (countdown === 0 && selectedGameType === 'with-user' && !opponent) {
            setOpponent('OpponentUsername');
        }
    }, [countdown, selectedGameType, opponent, setOpponent]);
    const handleConfirm = () => {
        axios.post('https://rockscissorpaper.xyz/api/ready', {
            type: type, 
            gameId: number
        }).then(res=> {
            setStatusConfirm(true)
        })
    }
    return (
        <div>
            <div>
                <p
                    style={{
                        marginTop: '5rem',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                        textAlign: 'center',
                        marginBottom: '0',
                    }}
                >
                    Противник найден
                </p>
                <p
                    style={{
                        color: 'grey',
                        fontSize: '1rem',
                        textAlign: 'center',
                        marginBottom: '5rem',
                    }}
                > 
                    Подтвердите игру, чтобы играть с оппонентом
                </p>
                <p style={{ textAlign: 'center' }}>Время на подтверждение</p>
                <br />
                <span style={{ fontWeight: 'bold' }} className="waiting-bet-timer">
                    {countdown} секунд
                </span>
                <p className="waiting-bet-amount">{gameBetAmount}</p>
                { statusConfirm == false && (<button className={`accept-button ${gameBetToken}-token`} onClick={handleConfirm} style={{background: token == 'ton' ? 'linear-gradient(to left, #0088CC, #0047FF)' : 'linear-gradient(to left, #5ABA20, #2DA01B)'}}>Подтвердить</button>)}
            </div>
        </div>
    );
};

export default WaitingConfirmingPage;

