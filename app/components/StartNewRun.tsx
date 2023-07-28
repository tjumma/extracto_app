'use client'

import { FC, useCallback, useState } from "react"
import { Button } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { startNewRun } from "../functions/startNewRun"

export const StartNewRun: FC = () => {

    const { runDataAddress, runDataAccount, playerDataAddress, playerDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantInitializeRun = ( !publicKey || !program || !runDataAddress || !playerDataAccount || playerDataAccount.isInRun)

    const startNewRunCallback = useCallback(async () => {
        await startNewRun(publicKey, program, playerDataAccount, runDataAddress, runDataAccount, playerDataAddress, showNotification, setLoading, sendTransaction, connection)
    }, [publicKey, runDataAddress, runDataAccount])

    return (
        <Button isLoading={isLoading} onClick={startNewRunCallback} isDisabled={cantInitializeRun} mb={5}>Start new run</Button>
    )
}