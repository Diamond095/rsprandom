import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useDepositStore from '@/app/stores/depositStore';
import './DepositPage.scss';
import axios from 'axios'
import { sendJetton } from '@/app/sendJetton';
import { getJettonWallet } from '@/app/getJettonWallet';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTonAddress } from '@tonconnect/ui-react';

const DepositPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const { amount, setDeposit } = useDepositStore();
    const navigate = useNavigate();
    const userAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();
    const [jettonWallet, setJettonWallet] = useState(null);
    const WALLET_ADDRESS = useTonAddress();

    useEffect(() => {
        const fetchJettonWallet = async (walletAddress) => {
            try {
                const jettonWalletData = await getJettonWallet(walletAddress);
                setJettonWallet(jettonWalletData);
            } catch (error) {
                console.error('Error occurred while fetching jetton wallet data:', error);
            }
        };

        if (WALLET_ADDRESS) {
            fetchJettonWallet(WALLET_ADDRESS);
        }
    }, [WALLET_ADDRESS]);

    const handleDeposit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const amount = Number(formData.get('amount'));
        const myJettonWallet = jettonWallet ? jettonWallet.result : null;
        try {
            let transactionHash;
            if (token == 'random') {
                transactionHash = await sendJetton(token, amount, myJettonWallet, tonConnectUI);
            } else {
                transactionHash = await sendJetton(token, amount, userAddress, tonConnectUI);
            }
            console.log("Transaction Hash: ", transactionHash);
            if (transactionHash) {
                axios.post('https://rockscissorpaper.xyz/api/deposit', {
                    hash: transactionHash,
                    amount: amount,
                    type: token,
                    userId: JSON.parse(localStorage.getItem('userObject')).id
                })
                    .then(res => {

                    });
            }
        } catch (error) {
            console.error("Error sending jetton: ", error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    const setQuickAmount = (value: number) => {
        const inputElement = document.querySelector('input[name="amount"]') as HTMLInputElement;
        inputElement.value = value.toString();
    };

    return (
        <div className="deposit-page">
            <form onSubmit={handleDeposit}>
                <div className="deposit-wrapper">
                    <h2>Пополение {token?.toUpperCase()}</h2>
                    <input
                        type="number"
                        name="amount"
                        defaultValue={amount || ''}
                        min="0.01"
                        step="0.01"
                        placeholder="Введите сумму пополнения"
                        className={`no-arrows ${token}-token`}
                    />
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
                        Пополнить
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DepositPage;
