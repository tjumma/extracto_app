'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"

interface Props {
    counterAddress: anchor.web3.PublicKey,
}

export const IncrementCounter: FC<Props> = ({ counterAddress }) => {

    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const increment = useCallback(async () => {
        console.log("Increment counter");

        if (!publicKey || !program || !counterAddress)
            return;

        try {
            setLoading(true)

            const tx = await program.methods
                .increment()
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
                title: "Counter incremented!",
                description: `Counter account incremented`,
                link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
            setLoading(false)

            showNotification({
                status: "error",
                title: "Increment error!",
                description: `${e}`,
            })
        }
    }, [publicKey, counterAddress])

    return (
        <Button isLoading={isLoading} onClick={increment} isDisabled={!publicKey || !program || !counterAddress} mb={5}>Increment manually</Button>
    )
}