import React, { useRef } from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { useState, useEffect } from 'react';
import './HomePageInfo.scss';
import rock from '@/app/assets/hands/rock.png';
import paper from '@/app/assets/hands/paper.png';
import scissor from '@/app/assets/hands/scissor.png';
import whiteArrow from '@/app/assets/white-arrow.svg';
import money from '@/app/assets/money.gif';
import axios from 'axios'

const HomePageInfo: React.FC = () => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<SheetRef>();
    const [chance, setChance] = useState(null);
    useEffect(()=>{
        axios.get('https://rockscissorpaper.xyz/api/chance')
        .then(res=>{
            setChance(res.data.toFixed(2))
        })
    }, [])
    return (
        <div className="home-page-info">
            <div className="home-page-info__header">
                <button className="home-page-info__button">
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://dedust.io/swap/TON/EQCF9oYxo37xCGX1DShZEweaVGJe6Kucp0ztKO6vCsRANDOM"
                    >
                        Купить <span className="random-token">$Random</span>
                    </a>
                </button>
                <button onClick={() => setOpen(true)} className="home-page-info__button home-page-info__button--info">
                    <span>Инфо</span>
                </button>
                <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
                    <Sheet.Container>
                        <Sheet.Header />
                        <Sheet.Content style={{ paddingBottom: ref.current?.y }}>
                            <Sheet.Scroller>
                                <div className="rules-text">
                                    <div style={{ fontWeight: 600, marginBottom: '2vw', fontSize: '14px' }}>
                                        1. Игра с игроком
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 400 }}>Как сыграть?</div>
                                    <div style={{ marginBottom: '2vw' }}>
                                        Вы можете создать игру и ждать оппонента, после чего начнется игра или же зайти
                                        в одну из игр которые создали другие игроки
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>Оплата ставки:</div>
                                    <div style={{ marginBottom: '2vw',fontSize: '14px' }}>
                                        На оплату ставки дается минута, если за это время кто-то из игроков не оплатит
                                        ставку тогда игра не начнется а если один игрок из комнаты оплатил, тогда
                                        происходит возврат. Минимальная ставка 2 random, максимальная ставка 500 random
                                    </div>
                                    <div style={{fontSize: '14px'}}>
                                        Каждый предмет либо кому-то проигрывает либо выигрывает. Если оба игрока выбрали
                                        один и тот же предмет происходит ничья.
                                    </div>
                                    <div className="hands" style={{display:'flex'}}>
                                        <div className="hands-rule">
                                            <img src={rock} alt="" className="hands-turn" />
                                            <img src={whiteArrow} className="white-arrow" alt="" />
                                            <img src={scissor} alt="" className="hands-turn" />
                                        </div>
                                        <div className="hands-rule">
                                            <img src={rock} alt="" className="hands-turn" />
                                            <img
                                                src={whiteArrow}
                                                className="white-arrow"
                                                style={{ transform: 'rotate(180deg)' }}
                                                alt=""
                                            />
                                            <img src={paper} alt="" className="hands-turn" />
                                        </div>
                                        <div className="hands-rule">
                                            <img src={paper} alt="" className="hands-turn" />
                                            <img
                                                src={whiteArrow}
                                                className="white-arrow"
                                                style={{ transform: 'rotate(180deg)' }}
                                                alt=""
                                            />
                                            <img src={scissor} alt="" className="hands-turn" />
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '14px', fontWeight: 500 }}>Время на ход</div>
                                    <div style={{ marginBottom: '2vw', fontSize: '14px' }}>
                                        Для каждого игрока дается на ход 60 секунд, если за это время игрок не успевает
                                        сделать ход победа автоматически переходит оппоненту
                                    </div>
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div style={{fontSize: '14px'}}>Выигрыш</div>
                                        <img src={money} style={{ width: '40px' }}></img>
                                    </div>
                                    После окончания игры победителю выдается 195% ставки на кошелек, выигрыш приходит в
                                    монете random
                                    <div
                                        style={{
                                            marginTop: '1vw',
                                            marginBottom: '1vw',
                                            fontWeight: 600,
                                            fontSize: '14px',
                                        }}
                                    >
                                        2. Игра с ботом
                                    </div>
                                    <div  style={{fontSize: '14px'}}>
                                        Игра с ботом полностью идентична, за исключением того, что бот случайным образом
                                        выкидывает предметы. Минимальная ставка 0.5 random, максимальная ставка 100
                                        random
                                    </div>
                                    <div  style={{fontSize: '14px'}}>После окончания игры смарт-контракт отдает победителю 197% ставки матча.</div>
                                </div>
                            </Sheet.Scroller>
                        </Sheet.Content>
                    </Sheet.Container>
                    <Sheet.Backdrop />
                </Sheet>
            </div>
            <div className="home-page-info__content">
                <span>Актуальный шанс выигрыша</span>
                <span className="home-page-info__content-chance">{chance}%</span>
            </div>
        </div>
    );
};

export default HomePageInfo;
