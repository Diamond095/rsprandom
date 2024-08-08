import React from 'react';
import { useGameCardStore } from '@/app/stores/gameCardStore';
import { useUserStore } from '@/app/stores/userStore';
import './GameList.scss';
import arrow from '@/app/assets/arrow.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

interface Game {
    gameNumber: number;
    creatorUsername: string;
    token: 'ton' | 'random';
    betSize: number;
    winsNeeded: number;
    type?: 'bot' | 'player';
    result?: 'ПОБЕДА' | 'ПОРАЖЕНИЕ';
    opponentName?: string;
    time?: string;
}

interface GameListProps {
    type: 'active' | 'inactive';
}

const GameList: React.FC<GameListProps> = ({ type }) => {
    const navigate = useNavigate()
    const activeGames = useGameCardStore((state) => state.activeGames);
    const inactiveGames = useGameCardStore((state) => state.inactiveGames);
    const balanceTon = useUserStore((state) => state.balanceTon);
    const balanceRandom = useUserStore((state) => state.balanceRandom);

    const getActiveGameClass = (token: 'ton' | 'random') => {
        return token == 'ton' ? 'game-card-ton' : 'game-card-random';
    };

    const getButtonClass = (token: 'ton' | 'random') => {
        return token === 'ton' ? 'enter-game-button-ton' : 'enter-game-button-random';
    };

    const getInactiveGameClass = (type: 'bot' | 'player', result: 'win' | 'lose') => {
        if (type === 'bot') {
            return result === 'ПОБЕДА' ? 'game-card-bot-win' : 'game-card-bot-lose';
        } else {
            return 'game-card-player';
        }
    };

    const handleJoinGame = async (game: Game) => {
        const userBalance = game.token === 'ton' ? balanceTon : balanceRandom;
        if (userBalance < game.betSize) {
            alert(`Недостаточно средств на балансе ${game.token.toUpperCase()}`);
            return;
        } else {
            const id = JSON.parse(localStorage.getItem('userObject')).id;
            await axios.post('https://rockscissorpaper.xyz/api/entergame', {
                'id': game.gameNumber,
                'user_id': id
            }).then(res => {
                navigate(`/waitingconfirm/${game.gameNumber}/enter`)
            })
        }

        // TODO: код для вступления в игру
    };

    return (
        <div className="game-list">
            {type === 'active'
                ? activeGames.map((game) => (
                      <div key={game.gameNumber} className={`game-card ${getActiveGameClass(game.token)}`}>
                          <div className="game-info">
                              <span className="game-number">Игра #{game.gameNumber}</span>
                              <span>@{game.creatorUsername}</span>
                          </div>
                          <div className="game-info">
                              <span className="game-bet">
                                  {game.betSize} {game.token}
                              </span>
                              <span>До {game.winsNeeded}  {(game.winsNeeded == 1) ? 'победы' : 'побед'} </span>
                          </div>
                          <button
                              className={`enter-game-button ${getButtonClass(game.token)}`}
                              onClick={() => handleJoinGame(game)}
                          ><div className="material-symbols-outlined" >
                              <img src={arrow} style={{width:'15px'}}></img>
                              </div>
                          </button>
                      </div>
                  ))
                : inactiveGames.map((game) => (
                      <div
                          key={game.gameNumber}
                          className={`game-card ${getInactiveGameClass(game.type, game.result)}`}
                      >
                          <div className="game-info">
                              <span className="game-number">Игра #{game.gameNumber}</span>
                              <span style={{overflow: 'hidden', width:'105px'}}>@{game.creatorUsername}</span>
                              {game.type === 'player' && <span style={{overflow: 'hidden', width:'105px'}}>@{game.opponentName}</span>}
                          </div>
                          <span className="game-bet">
                              {game.betSize} {game.token}
                          </span>
                          <div className="game-info">
                              <span className="game-time">{game.time}</span>
                              <span className="game-result">{game.type == 'bot' ? game.result : 'ВЫИГРАЛ'}</span>
                              <span>{game.type == 'player' ? '@' + game.winnerName : null}</span>
                          </div>
                      </div>
                  ))}
        </div>
    );
};

export default GameList;
