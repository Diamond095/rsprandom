import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './WalletPage.scss';
import 'react-tabs/style/react-tabs.css';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useUserStore } from '@/app/stores/userStore';
import Alert from '@/shared/ui/Alert/Alert';
import tonLogo from '@/app/assets/tokens/token_ton.png';
import randomLogo from '@/app/assets/tokens/token_random.png';
import { useTonAddress } from '@tonconnect/ui-react';
import axios from 'axios'
const WalletPage: React.FC = () => {
    const isWalletConnected = useUserStore((state) => state.isWalletConnected);
    const [showAlert, setShowAlert] = useState(false);
    const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate(-1);
    };
    const userAddress = useTonAddress();
    const [jettonWallet, setJettonWallet] = useState(null);

    useEffect(() => {
        console.log(userAddress)
        const fetchJettonWallet = async () => {
            if (userAddress) {
                try {
                    axios.post('https://rockscissorpaper.xyz/api/changewallet', { 
                        wallet: userAddress,
                        id: JSON.parse(localStorage.getItem('userObject')).id })
                } catch (error) {
                }
            }
        };
        fetchJettonWallet(jettonWallet);
    }, [userAddress]);
    const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!isWalletConnected) {
            event.preventDefault();
            setShowAlert(true);
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
            alertTimeoutRef.current = setTimeout(() => setShowAlert(false), 3000); // скрыть alert через 3 секунды
        }
    };

    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    const renderPaymentMethods = (type: string) => (
        <div className="payment-methods">
            <Link to={`/${type}/ton`} className="payment-method" onClick={handleLinkClick}>
                <img src={tonLogo} alt="TON logo" />
                <span>TON</span>
            </Link>
            <Link to={`/${type}/random`} className="payment-method" onClick={handleLinkClick}>
                <img src={randomLogo} alt="RANDOM logo" />
                <span>RANDOM</span>
            </Link>
        </div>
    );

    return (
        <div className="wallet-page">
            <Tabs>
                <TonConnectButton className="ton-connect-button" />
                <TabList className="tab-list">
                    <Tab className="tab" selectedClassName="selected-tab">
                        Депозит
                    </Tab>
                    <Tab className="tab" selectedClassName="selected-tab">
                        Вывод
                    </Tab>
                </TabList>

                <TabPanel className="tab-panel">
                    <div className="deposit-section">
                        <span className="section-title">Выберите токен для депозита</span>
                        {renderPaymentMethods('deposit')}
                    </div>
                </TabPanel>
                <TabPanel className="tab-panel">
                    <div className="withdraw-section">
                        <span className="section-title">Выберите токен для вывода</span>
                        {renderPaymentMethods('withdraw')}
                    </div>
                </TabPanel>
            </Tabs>
            <button className="cancel-button" onClick={handleCancel}>
                Отмена
            </button>
            {showAlert && <Alert onClose={() => setShowAlert(false)}>Подключите кошелек!</Alert>}
        </div>
    );
};

export default WalletPage;

