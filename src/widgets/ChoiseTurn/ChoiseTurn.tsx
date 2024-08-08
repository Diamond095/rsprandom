import { Item, useGameStore } from '@/app/stores/gameStore';
import paper from '@/app/assets/hands/paper.png';
import rock from '@/app/assets/hands/rock.png';
import scissor from '@/app/assets/hands/scissor.png';
import axios from 'axios'
import './ChoiseTurn.scss'
import { useUserStore } from '@/app/stores/userStore'
import { useNavigate } from "react-router-dom";
const ChoiseTurn: React.FC = () => {
    const navigate = useNavigate()
    const { resultGame, statusTurn, setStatus, type, addTurn, gameNumber, setTimer, setIsRed, setResult, idTurn, statusRequestCompletion, setStatusRequestCompletion, reset } = useGameStore((state) => ({
        resultGame: state.totalResult,
        statusTurn: state.statusTurn,
        setStatus: state.setStatusTurn,
        type: state.type,
        addTurn: state.addTurn,
        gameNumber: state.gameNumber,
        setTimer: state.setTimer,
        setIsRed: state.setIsRed,
        setResult: state.setTotalResult,
        idTurn: state.idTurn,
        statusRequestCompletion: state.statusRequestCompletion,
        setStatusRequestCompletion: state.setStatusRequestCompletion, 
        reset: state.reset
    }))
    const id = JSON.parse(localStorage.getItem('userObject')).id;
    const { tonBalance, randomBalance, setTonBalance, setRandomBalance } = useUserStore((state) => ({
        tonBalance: state.balanceTon,
        randomBalance: state.balanceRandom,
        setRandomBalance: state.setBalanceRandom,
        setTonBalance: state.setBalanceTon
    }))
    const handleChoice = (choice: Item) => {
        setTimer(60);
        setIsRed(false);
        const userId = JSON.parse(localStorage.getItem('userObject')).id;
        const secondId = JSON.parse(localStorage.getItem('userObject')).secondId;
        if (type === 'create') {
            setStatus(false)
            axios.get(`https://rockscissorpaper.xyz/api/createuserturn/${userId}/${gameNumber}/${choice}/${secondId}`)
                .then(res => {

                });
        } else if (type === 'enter') {
            setStatus(false)
            axios.get(`https://rockscissorpaper.xyz/api/enteruserturn/${userId}/${idTurn}/${choice}/${secondId}`)
                .then(res => {
                    addTurn({
                        createUserItem: res.data.createUserItem,
                        enterUserItem: choice,
                        result: res.data.turnResult
                    })
                    if (res.data.result) {
                        setResult(res.data.result);
                        if (res.data.result == 'ПОРАЖЕНИЕ') {
                            if (res.data.typePayment == 'ton') {
                                setTonBalance(tonBalance - res.data.summOfBet)
                            } else {
                                setRandomBalance(randomBalance - res.data.summOfBet)
                            }
                        } else {
                            if (res.data.typePayment == 'ton') {
                                setTonBalance(tonBalance + 0.95*res.data.summOfBet)
                            } else {
                                setRandomBalance(randomBalance + 0.95*res.data.summOfBet)
                            }
                        }
                    }
                });
        } else {
            setStatusRequestCompletion(true)
            axios.get(`https://rockscissorpaper.xyz/api/turnwithbot/${id}/${choice}/${gameNumber}/${secondId}`)
                .then(res => {
                    setStatusRequestCompletion(false);
                    let result = null;
                    addTurn(
                        {
                            createUserItem: res.data.userItem,
                            enterUserItem: res.data.botItem,
                            result: res.data.turnResult
                        })
                    if (res.data.result) {
                        setResult(res.data.result);
                        if (res.data.result == 'ПОРАЖЕНИЕ') {
                            if (res.data.typePayment == 'ton') {
                                setTonBalance(tonBalance - res.data.summOfBet)
                            } else {
                                setRandomBalance(randomBalance - res.data.summOfBet)
                            }
                        } else {
                            if (res.data.typePayment == 'ton') {
                                setTonBalance(tonBalance + 0.97*res.data.summOfBet)
                            } else {
                                setRandomBalance(randomBalance + 0.97*res.data.summOfBet)
                            }
                        }
                    }
                });
        }
    }
    const handleNavigate = () => {
        reset()
        navigate('/')
    }
    return (
        <div>
            { type != 'with-bot' && statusTurn && !resultGame && (
                <div className='items'>
                    <div className='item'>
                        <img className='rock' src={rock} onClick={() => handleChoice('rock')}></img>
                    </div>
                    <div className='item'>
                        <img className='scissor' src={scissor} onClick={() => handleChoice('scissor')}></img>
                    </div>
                    <div className='item'>
                        <img className='paper' src={paper} onClick={() => handleChoice('paper')}></img>
                    </div>
                </div>) } 
                {(resultGame) &&  (<button className="cancel-button" onClick={handleNavigate} style={{marginLeft:'16px'}}>
                    Главная
                </button>)} 
            {!resultGame && type == 'with-bot' && !statusRequestCompletion && (
                <div className='items'>
                    <div className='item' onClick={() => handleChoice('rock')}>
                        <img className='rock' src={rock}></img>
                    </div>
                    <div className='item' onClick={() => handleChoice('scissor')}>
                        <img className='scissor' src={scissor}></img>
                    </div>
                    <div className='item' onClick={() => handleChoice('paper')}>
                        <img className='paper' src={paper}></img>
                    </div>
                </div>) }
                </div>

    )
}
export default ChoiseTurn
