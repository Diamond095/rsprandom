import React, { useEffect, useState } from 'react';
import { useGameCardStore } from '@/app/stores/gameCardStore';
import { useGameStore } from '@/app/stores/gameStore';
import './WaitingGamePage.scss';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WaitingGamePage: React.FC = () => {
    const navigate = useNavigate()
    let { number } = useParams()

    useEffect(() => {
        window.Echo.channel(`entercertaingame${number}`).listen('.entercertaingame', data => {
            navigate(`/waitingconfirm/${number}/create`);
        });
    }, []);
    const handleCancel = () => {
        axios.delete(`https://rockscissorpaper.xyz/api/game/${number}`)
            .then(() => navigate('/'))
    }
    return (
        <div>
            <p
                style={{
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    textAlign: 'center',
                    marginTop: '10rem',
                    marginBottom: '0',
                }}
            >
                Игра создана #{number}
            </p>
            {/* Ожидание игрока */}
            <p style={{ textAlign: 'center' }}>Ожидайте игрока...</p>
            <button className="cancel-button" onClick={handleCancel} style={{ margin: '1rem' }}>Отмена</button>
        </div >
    );
};

export default WaitingGamePage;

