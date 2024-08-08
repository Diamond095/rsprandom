import React, { useEffect, useState } from 'react';
import { useGameCardStore, TokenType } from '@/app/stores/gameCardStore';
import { useUserStore } from '@/app/stores/userStore';
import randomToken from '@/app/assets/tokens/token_random.png';
import tonToken from '@/app/assets/tokens/token_ton.png';
import './GameSetup.scss';
import { useParams } from 'react-router-dom';

const GameSetup: React.FC = () => {
    const { gameBetToken, setGameBetToken, gameBetAmount, setGameBetAmount, winsTillEnd, setWinsTillEnd, errors } =
        useGameCardStore((state) => ({
            gameBetToken: state.gameBetToken,
            setGameBetToken: state.setGameBetToken,
            gameBetAmount: state.gameBetAmount,
            setGameBetAmount: state.setGameBetAmount,
            winsTillEnd: state.winsTillEnd,
            setWinsTillEnd: state.setWinsTillEnd,
            errors: state.errors
        }));

    const { balanceTon, balanceRandom } = useUserStore((state) => ({
        balanceTon: state.balanceTon,
        balanceRandom: state.balanceRandom,
    }));
    let { type } = useParams()
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const MAX_BET_FOR_RANDOM = 60;
    const MAX_BET_FOR_TON = 10;
    const MAX_WINS = 5;

    useEffect(() => {
        if (!gameBetToken) setGameBetToken('random');
        if (gameBetAmount === null) setGameBetAmount(null);
        if (winsTillEnd === 0) setWinsTillEnd(1);
    }, [gameBetToken, gameBetAmount, winsTillEnd, setGameBetToken, setGameBetAmount, setWinsTillEnd]);

    const handleTokenClick = (token: TokenType) => {
        setGameBetToken(token);
    };

    const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? null : Number(event.target.value);
        if (gameBetToken === 'ton' && value !== null && value > balanceTon) {
            setErrorMessage('Недостаточно средств на балансе TON');
        } else if (gameBetToken === 'random' && value !== null && value > balanceRandom) {
            setErrorMessage('Недостаточно средств на балансе Random');
        } else {
            setErrorMessage(null);
            setGameBetAmount(value !== null ? value : null);
        }
    };

    const setQuickBetAmount = (value: number | null) => {
        let newBetAmount: number | null = null;
        if ((value === MAX_BET_FOR_RANDOM && gameBetToken == 'random') || (value === MAX_BET_FOR_TON && gameBetToken == 'ton')) {
            if (gameBetToken === 'ton') {
                newBetAmount = Math.min(MAX_BET_FOR_TON, balanceTon);
            } else if (gameBetToken === 'random') {
                newBetAmount = Math.min(MAX_BET_FOR_RANDOM, balanceRandom);
            }
        } else {
            newBetAmount = value;
        }

        if (gameBetToken === 'ton' && newBetAmount !== null && newBetAmount > balanceTon) {
            setErrorMessage('Недостаточно средств на балансе TON');
        } else if (gameBetToken === 'random' && newBetAmount !== null && newBetAmount > balanceRandom) {
            setErrorMessage('Недостаточно средств на балансе Random');
        } else {
            setErrorMessage(null);
            setGameBetAmount(newBetAmount);
        }
    };

    const incrementWins = () => setWinsTillEnd(Math.min(MAX_WINS, winsTillEnd + 1));
    const decrementWins = () => setWinsTillEnd(Math.max(1, winsTillEnd - 1));

    return (
        <div className="game-setup">
            <div className="game-setup__token">
                <div
                    className={`random ${gameBetToken === 'random' ? 'selected' : ''}`}
                    onClick={() => handleTokenClick('random')}
                >
                    {gameBetToken === 'random' && <img src={randomToken} alt="Random Token" />}
                    Random
                </div>
                <div
                    className={`ton ${gameBetToken === 'ton' ? 'selected' : ''}`}
                    onClick={() => handleTokenClick('ton')}
                >
                    {gameBetToken === 'ton' && <img src={tonToken} alt="TON Token" />}
                    TON
                </div>
            </div>
            <div className="game-setup__bet">
                <span>Ставка</span>
                <input
                    type="number"
                    className="game-setup__bet-input"
                    placeholder="Сумма ставки"
                    value={gameBetAmount !== null ? gameBetAmount : ''}
                    onChange={handleBetChange}
                />
                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}. Пополните баланс чтобы начать игру!
                        <br />
                    
                    </div>
                )}
                <div className="quick-choice">
                    <button type="button" onClick={() => setQuickBetAmount(type == 'with-bot' ?  0.5 : 2)}>
                        мин
                    </button>
                    <button type="button" onClick={() => setQuickBetAmount(type == 'with-bot' ? 1 : 3)}>
                        {type == 'with-bot' ? 1 : 3}
                    </button>
                    <button type="button" onClick={() => setQuickBetAmount(5)}>
                        5
                    </button>
                    <button type="button" onClick={() => setQuickBetAmount(10)}>
                        10
                    </button>
                    <button type="button" onClick={() => setQuickBetAmount(gameBetToken == 'random' ?  MAX_BET_FOR_RANDOM : MAX_BET_FOR_TON)}>
                        макс
                    </button>
                </div>
            </div>
            <div className="game-setup__wins-till-end">
                <span>Количество побед</span>
                <div className="wins-selector">
                    <button onClick={decrementWins} disabled={winsTillEnd <= 1}>
                        -
                    </button>
                    <span>{winsTillEnd}</span>
                    <button onClick={incrementWins} disabled={winsTillEnd >= MAX_WINS}>
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameSetup;
