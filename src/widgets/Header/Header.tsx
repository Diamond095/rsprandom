import React, {useEffect} from 'react';
import './Header.scss';
import logo from '@/app/assets/Logo.png';
import tokenRandom from '@/app/assets/tokens/token_random.png';
import tokenTon from '@/app/assets/tokens/token_ton.png';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/app/stores/userStore';
import walllet from '@/app/assets/wallet.png'
import { useNavigate } from 'react-router-dom';

const TokenDisplay: React.FC<{ amount: number; src: string; alt: string }> = ({ amount, src, alt }) => (
    <div className="token-display">
        <span>{amount.toFixed(2)}</span>
        <img src={src} alt={alt} />
    </div>
);

const Header: React.FC = () => {
    const navigate = useNavigate();
    const { balanceTon, balanceRandom, setTonBalance, setRandomBalance } = useUserStore((state) => ({
        balanceTon: state.balanceTon,
        balanceRandom: state.balanceRandom,
        setRandomBalance: state.setBalanceRandom, 
        setTonBalance: state.setBalanceTon
    }));

    useEffect(()=>{
        const id = JSON.parse(localStorage.getItem('userObject')).id;
        window.Echo.channel(`deposit${id}`).listen('.deposit', data => {
            if(data.type == 'random'){
                setRandomBalance(balanceRandom + data.amount)
            } else {
                setTonBalance(balanceTon + data.amount)
            }
        })
    },[])

    const handleNavigate = () => {
        navigate('/')
    }
    return (
        <header className="header">
            <div className="game-logo">
                <img src={logo} alt="Game Logo" style={{width:'55px'}} onClick={handleNavigate}/>
            </div>
            <div className="wallet-balance">
                <TokenDisplay amount={balanceTon} src={tokenTon} alt="Ton Token" />
                <TokenDisplay amount={balanceRandom} src={tokenRandom} alt="Random Token" />
            </div>
            <div className="gradient-border">
                <div className="wallet-item">
                    <Link to="/wallet">
                        <img className="material-symbols-outlined" src={walllet}></img>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
