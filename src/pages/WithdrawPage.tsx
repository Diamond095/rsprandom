import React, {useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWithdrawalStore from '@/app/stores/withdrawalStore';
import './WithdrawPage.scss';
import axios from 'axios'
import { useUserStore } from '@/app/stores/userStore';

const WithdrawPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { amount, setWithdrawal } = useWithdrawalStore();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { balanceTon, balanceRandom, setTonBalance, setRandomBalance } = useUserStore((state) => ({
        balanceTon: state.balanceTon,
        balanceRandom: state.balanceRandom,
        setRandomBalance: state.setBalanceRandom, 
        setTonBalance: state.setBalanceTon
    }));

    const handleWithdrawal = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const amount = Number(formData.get('amount'))
        if((amount < balanceRandom && token == 'random') || (amount < balanceTon && token == 'ton')){
        const id = JSON.parse(localStorage.getItem('userObject')).id
        axios.post('https://rockscissorpaper.xyz/api/withdrawal', {
            userId: id, 
            amount: amount, 
            type: token
        }).then(res=>{
            if(token == 'random') {
                setRandomBalance(balanceRandom - amount)
            } else{ 
                setTonBalance(balanceTon - amount)
            }
        })
    }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const handleBetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value === '' ? null : Number(event.target.value);
        if (token === 'ton' && value !== null && value > balanceTon) {
            setErrorMessage('Недостаточно средств на балансе TON');
        } else if (token === 'random' && value !== null && value > balanceRandom) {
            setErrorMessage('Недостаточно средств на балансе Random');
        } else {
            setErrorMessage(null);
        }
    };
    const setQuickAmount = (value: number) => {
        const inputElement = document.querySelector('input[name="amount"]') as HTMLInputElement;
        inputElement.value = value.toString();
    };

    return (
        <div className="withdraw-page">
            <form onSubmit={handleWithdrawal}>
                <div className="withdraw-wrapper">
                    <h2>Вывод {token?.toUpperCase()}</h2>
                    <input
                        type="number"
                        name="amount"
                        defaultValue={amount || ''}
                        min="0.01"
                        step="0.01"
                        placeholder="Введите сумму вывода"
                        className={`no-arrows ${token}-token`}
                        onChange={handleBetChange}
                        />
                         {errorMessage && (
                    <div className="error-message" style={{margin:'0'}}>
                        {errorMessage}. Пополните баланс чтобы начать игру!
                        <br />
                    
                    </div>
                )}
                    <div className="quick-select">
                        <button type="button" onClick={() => setQuickAmount(1)}>
                            мин
                        </button>
                        <button type="button" onClick={() => setQuickAmount(10)}>
                            10
                        </button>
                        <button type="button" onClick={() => setQuickAmount(25)}>
                            25
                        </button>
                        <button type="button" onClick={() => setQuickAmount(50)}>
                            50
                        </button>
                        <button type="button" onClick={() => setQuickAmount(100)}>
                            100
                        </button>
                    </div>
                </div>
                <div className="payment-navigation-buttons">
                    <button type="button" onClick={handleCancel}>
                        Отмена
                    </button>
                    <button type="submit" className="payment-button">
                        Вывести
                    </button>
                </div>
            </form>
        </div>
    );
};

export default WithdrawPage;
