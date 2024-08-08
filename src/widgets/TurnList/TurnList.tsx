import { Color, Item, TurnResult, useGameStore } from '@/app/stores/gameStore';
import paper from '@/app/assets/hands/paper.png';
import rock from '@/app/assets/hands/rock.png';
import scissor from '@/app/assets/hands/scissor.png';
import winRock from '@/app/assets/hands/КамЗел.png';
import loseRock from '@/app/assets/hands/КамКрас.png';
import drawRock from '@/app/assets/hands/КамБел.png';

import winPaper from '@/app/assets/hands/БумЗел.png';
import losePaper from '@/app/assets/hands/БумКрас.png';
import drawPaper from '@/app/assets/hands/БумБел.png';

import winScissors from '@/app/assets/hands/НожЗел.png';
import loseScissors from '@/app/assets/hands/НожКрас.png';
import drawScissors from '@/app/assets/hands/НожБел.png';

import './TurnList.scss';

const TurnList: React.FC = () => {
    const { turns, type, opponent } = useGameStore((state) => ({
        turns: state.turns,
        type: state.type,
        opponent: state.opponent,
    }));

    const images = {
        paper: {
            default: paper,
            win: winPaper,
            lose: losePaper,
            draw: drawPaper,
        },
        rock: {
            default: rock,
            win: winRock,
            lose: loseRock,
            draw: drawRock,
        },
        scissor: {
            default: scissor,
            win: winScissors,
            lose: loseScissors,
            draw: drawScissors,
        },
    };

    const username = JSON.parse(localStorage.getItem('userObject')).name;

    const getResultImage = (item, result) => {
        switch (result) {
            case 'Победа':
                return images[item].win;
            case 'Поражение':
                return images[item].lose;
            case 'Ничья':
                return images[item].draw;
            default:
                return images[item].default;
        }
    };

    return (
        <div className="turns-list">
            <div className="turnsHeader fade-in">
                <span>{username}</span>
                <span className="vs">vs</span>
                <span>{opponent || 'Opponent'}</span>
            </div>
            <div className="turnsContainer fade-in">
                {turns.map((turn, index) => (
                    <div className="turns" style={{ background: turn.backgroudColor }} key={index}>
                        <img
                            src={
                                type === 'enter'
                                    ? getResultImage(turn.enterUserItem, turn.result)
                                    : getResultImage(turn.createUserItem, turn.result)
                            }
                            className="left-turn-item"
                            alt="left-item"
                        />
                        <div className="result">{turn.result}</div>
                        <img
                            src={
                                type === 'enter'
                                    ? getResultImage(turn.createUserItem, turn.result)
                                    : getResultImage(turn.enterUserItem, turn.result)
                            }
                            className="right-turn-item"
                            alt="right-item"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TurnList;
