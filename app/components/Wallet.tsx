'use client'

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BackpackWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const Wallet: FC<{ children: ReactNode }> = ({ children }) => {
    // const network = WalletAdapterNetwork.Devnet;
    // const endpoint = 'https://devnet.helius-rpc.com/?api-key=55950a21-6f37-438c-9a7d-2450856a5db8';
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const network = 'localnet' as WalletAdapterNetwork;
    const endpoint = "http://localhost:8899";

    const wallets = useMemo(
        () => [
            new BackpackWalletAdapter(),
            new SolflareWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {/* <WalletMultiButton />
                    <WalletDisconnectButton /> */}
                    { /* Your app's components go here, nested within the context providers. */ }
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};