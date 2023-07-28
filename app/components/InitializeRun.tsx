'use client'

import { FC, useCallback, useState } from "react"
import { Button } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { initializeRun } from "../functions/initializeRun"

export const InitializeRun: FC = () => {

    const { runDataAddress, runDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantInitializeRun = ( !publicKey || !program || !runDataAddress || runDataAccount !== null)

    const initializeRunCallback = useCallback(async () => {
        await initializeRun(publicKey, program, runDataAddress, runDataAccount, showNotification, setLoading, sendTransaction, connection)
    }, [publicKey, runDataAddress, runDataAccount])

    return (
        <Button isLoading={isLoading} onClick={initializeRunCallback} isDisabled={cantInitializeRun} mb={5}>Initialize run account</Button>
    )
}