'use client'

import { SessionWalletProvider, useSessionKeyManager } from '@gumhq/react-sdk';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { connection } = useConnection();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const cluster = "devnet";
  const sessionWallet = useSessionKeyManager(anchorWallet, connection, cluster);

  return (
    <SessionWalletProvider sessionWallet={sessionWallet}>
      {children}
    </SessionWalletProvider>
  );
};

export default SessionProvider;