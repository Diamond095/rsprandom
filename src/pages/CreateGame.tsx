import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameCardStore } from '@/app/stores/gameCardStore';
import { GameSetup } from '@/widgets/GameSetup';
import './CreateGame.scss';
import axios from 'axios'
import loadinggif from '@/app/assets/loading.gif'

const CreateGame: React.FC = () => {
    const gameType = useGameCardStore((state) => state.selectedGameType);
    const betToken = useGameCardStore((state) => state.gameBetToken);
    const betAmount = useGameCardStore((state) => state.gameBetAmount);
    const winsTillEnd = useGameCardStore((state) => state.winsTillEnd);
    const navigate = useNavigate();
    let { type } = useParams()
    const [loading, setLoading] = useState(false)
    const setErrors = useGameCardStore((state) => state.setErrors)
    const isGameReady = !!betToken && betAmount !== null && betAmount > 0 && winsTillEnd > 0;
  

    const handleCreateGame = () => {
        const postData = {
            summOfBet: betAmount,
            amountOfTurns: winsTillEnd,
            createUserId: JSON.parse(localStorage.getItem('userObject')).id,
            type: betToken
        };
        if (type == 'with-bot') {
            if((betToken == 'ton' && betAmount <= 10) || (betToken == 'random' && betAmount <= 60)){
                if (betAmount && winsTillEnd) {
                    setLoading(true);
                }
            axios.post('https://rockscissorpaper.xyz/api/gamewithbot', postData)
                .then((response) => {
                    setLoading(false);
                    navigate(`/game/${response.data.id}/with-bot`)
                })
                .catch((error) => {
                    setLoading(false);
                    if (error.response) {
                        setErrors(error.response.data.errors);
                    }
                });
            }
        }
        if (type == 'with-user') {
            if (betAmount && winsTillEnd) {
                setLoading(true);
            }
            axios.post('https://rockscissorpaper.xyz/api/game', postData)
                .then(res => {
                    navigate(`/waiting/${res.data.data.number}`)
                }).catch((error) => {
                    setLoading(false);
                    if (error.response) {
                        setErrors(error.response.data.errors);
                    }
                });
        }
    }

    const handleCancel = () => {
        navigate(-1);
    };
    return (
        <div className="create-game__wrapper">
            {type === 'with-user' && (
                <>
                    <div className="create-game__content">
                        <h1>Создать игру</h1>
                        <GameSetup />
                    </div>
                </>
            )}

            {type === 'with-bot' && (
                <>
                    <div className="create-game__content">
                        <h1>Игра с ботом</h1>
                        <GameSetup />
                    </div>
                </>
            )}

            <div className="create-game__buttons">
                <button
                    className="create-game__button create-game__button--cancel button-animation"
                    onClick={handleCancel}
                >
                    Отмена
                </button>
                 {!loading && (
                <button
                    className="create-game__button create-game__button--create button-animation"
                    disabled={!isGameReady}
                    onClick={handleCreateGame}
                >
                    {type == 'with-user' ? 'Создать игру' : 'Оплатить'}
                </button>
                )}
                {loading && (
                    <div style={{width:'45%' }}>
                        <div style={{marginLeft: '41%', marginTop: '12px'}}>
                        <img src={loadinggif} style={{ width: '40px' }}></img>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateGame;
