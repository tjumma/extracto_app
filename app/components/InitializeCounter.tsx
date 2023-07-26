'use client'

import { FC, useCallback, useState } from "react"
import { Button } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { initializeCounter } from "../functions/initializeCounter"

export const InitializeCounter: FC = () => {

    const { counterAddress, counterDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantInitializeCounter = ( !publicKey || !program || !counterAddress || counterDataAccount !== null)

    const initializeCounterCallback = useCallback(async () => {
        await initializeCounter(publicKey, program, counterAddress, counterDataAccount, showNotification, setLoading, sendTransaction, connection)
    }, [publicKey, counterAddress, counterDataAccount])

    return (
        <Button isLoading={isLoading} onClick={initializeCounterCallback} isDisabled={cantInitializeCounter} mb={5}>Initialize counter account</Button>
    )
}