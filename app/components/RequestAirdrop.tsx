import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, TransactionSignature } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { Button } from '@chakra-ui/react';
import { useNotificationContext } from '../contexts/NotificationContext';

export const RequestAirdrop: FC = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const { showNotification } = useNotificationContext()

    const requestAirdropCallback = useCallback(async () => {
        if (!publicKey) {
            return;
        }

        let signature: TransactionSignature = '';

        try {
            signature = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

            // Get the lates block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash()
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            showNotification({
                status: "success",
                title: "Airdrop successful!",
            })

        } catch (error: any) {
            showNotification({
                status: "error",
                title: "Airdrop failed!",
                description: error?.message
            })
        }
    }, [publicKey, connection]);

    return (
        <Button width = "400px" mb={6} isDisabled = {!publicKey} onClick={requestAirdropCallback}>Request airdrop</Button> 
    );
};