import React from 'react';
import { Link } from 'react-router-dom';
import { useGameCardStore } from '@/app/stores/gameCardStore';
import './ChooseGameNavigation.scss';

const ChooseGameNavigation: React.FC = () => {
    const setGameType = useGameCardStore((state) => state.setGameType);

    const handleGameTypeSelection = (type: 'with-user' | 'with-bot') => () => {
        setGameType(type);
    };

    return (
        <div className="create-game-navigation">
            <Link to="/creategame/with-user" className="create-game-navigation__link">
                <button className="create-game-navigation__button" onClick={handleGameTypeSelection('with-user')}>
                    Создать игру
                </button>
            </Link>
            <Link to="/creategame/with-bot" className="create-game-navigation__link">
                <button className="create-game-navigation__button" onClick={handleGameTypeSelection('with-bot')}>
                    Играть с ботом
                </button>
            </Link>
        </div>
    );
};

export default ChooseGameNavigation;
