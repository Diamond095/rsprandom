import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/app/stores/gameStore';
import './TopPartGame.scss';

const TopPartGame: React.FC = () => {
    let {
        totalResult,
        currentPlayer,
        type,
        timer,
        setTimer,
        setIsRed,
        isRed,
        statusTurn
    } = useGameStore((state) => ({
        totalResult: state.totalResult,
        currentPlayer: state.currentPlayer,
        type: state.type,
        timer: state.timer,
        setTimer: state.setTimer,
        isRed: state.isRed,
        setIsRed: state.setIsRed,
        statusTurn: state.statusTurn
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
            if (timer <= 15) {
                setIsRed(!isRed);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);


    const getResultClass = () => {
        switch (totalResult) {
            case 'ПОБЕДА':
                return 'finished-win';
            case 'ПОРАЖЕНИЕ':
                return 'finished-lose';
            case 'Ничья':
                return 'finished-draw';
            default:
                return '';
        }
    };

    const getTypeClass = () => {
        if (type === 'with-bot') {
            return 'game-with-bot';
        } else if (type === 'with-user') {
            return 'game-with-user';
        }
        return '';
    };

    return (
        <div className={`top-part-game ${getTypeClass()}`}>
            {totalResult ? (
                <div className={`result-text ${getResultClass()}`}>{totalResult}</div>
            ) : (statusTurn || type == 'with-bot' ? (
                <div className='main-status-text'>
                    <div
                        className="status-text my-turn"
                    >
                        Ваш ход
                    </div>
                    <div
                        className="timer-text my-turn-timer"
                        style={{ color: isRed ? 'red' : 'white' }}
                    >
                        Осталось {timer} секунд
                    </div>
                </div>
            ) : (
            <div>
                <div
                    className="status-text opponent-turn"
                >
                    Ход противника
                </div>
                <div
                    className="timer-text opponent-turn-timer"
                    style={{ color: isRed ? 'red' : 'white' }}
                >
                    Осталось {timer} секунд
                </div>
            </div>
            ))}
        </div>
    );
};

export default TopPartGame;

