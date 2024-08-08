import { TonConnectUIProvider } from '@tonconnect/ui-react';
import React from 'react';

interface TonConnectProviderProps {
    children: React.ReactNode;
}

const TonConnectProvider: React.FC<TonConnectProviderProps> = ({ children }) => {
    return <TonConnectUIProvider manifestUrl="https://rsprandom.xyz/manifest.json">{children}</TonConnectUIProvider>;
};

export default TonConnectProvider;
