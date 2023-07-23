import { FC, useCallback, useState } from "react"
import * as anchor from "@coral-xyz/anchor"
import { Button } from "@chakra-ui/react";
import { CounterDataAccount } from "../views/ClockworkView";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface Props {
    counterAddress: anchor.web3.PublicKey,
    counterDataAccount: CounterDataAccount | null
}

export const InitializeCounter: FC<Props> = ({ counterAddress, counterDataAccount }) => {

    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isInitializeLoading, setIsInitializeLoading] = useState(false)

    const initialize = useCallback(async () => {
        console.log("Initialize");

        if (counterDataAccount) {
            console.log("Counter account is already initialized");

            showNotification({
                status: "info",
                title: "Already initialized!",
                description: `Counter account is already initialized`,
                link: `https://solana.fm/address/${counterAddress}?cluster=http://localhost:8899`,
                linkText: "Counter account"
            })
        }
        else {
            try {
                setIsInitializeLoading(true)

                const tx = await program.methods
                    .initialize()
                    .accounts({
                        counter: counterAddress,
                        user: publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
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

                setIsInitializeLoading(false)

                showNotification({
                    status: "success",
                    title: "Counter initialized!",
                    description: `Counter account initialized`,
                    link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                    linkText: "Transaction"
                })
            }
            catch (e) {
                setIsInitializeLoading(false)

                showNotification({
                    status: "error",
                    title: "Initialize error!",
                    description: `${e}`,
                })
            }
        }
    }, [publicKey, counterAddress, counterDataAccount])

    return (
        <Button isLoading={isInitializeLoading} onClick={initialize} isDisabled={!publicKey} mb={5}>Initialize counter account</Button>
    )
}