'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from 'react'
import { useAnchorContext } from "../contexts/AnchorContext"
import { Button } from "@chakra-ui/react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useGameContext } from "../contexts/GameContext"

export const ResetCounter: FC = () => {

    const { counterAddress } = useGameContext()
    const [isLoading, setLoading] = useState(false)
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const reset = useCallback(async () => {
        console.log("Reset counter");

        if (!publicKey || !program || !counterAddress)
            return;

        try {
            setLoading(true)

            const tx = await program.methods
                .reset()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                })
                .transaction()

            const txSig = await sendTransaction(tx, connection, {
                skipPreflight: true,
            })

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txSig,
            })

            setLoading(false)

            showNotification({
                status: "success",
                title: "Counter reset!",
                description: `Counter has been reset`,
                link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
            setLoading(false)

            showNotification({
                status: "error",
                title: "Reset error!",
                description: `${e}`,
            })
        }
    }, [publicKey, counterAddress])

    return (
        <Button isLoading={isLoading} onClick={reset} isDisabled={!publicKey || !program || !counterAddress} mb={5}>Reset counter</Button>
    )
}