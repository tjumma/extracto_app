'use client'

import { FC, useCallback, useState } from "react"
import { Button } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { startNewRun } from "../functions/startNewRun"

export const StartNewRun: FC = () => {

    const { runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantStartNewRun = (!publicKey || !program || !runDataAddress || !playerDataAccount || playerDataAccount.isInRun || !thread || !threadAuthority || !threadId)

    const startNewRunCallback = useCallback(async () => {
        await startNewRun(publicKey, program, playerDataAccount, runDataAddress, runDataAccount, playerDataAddress, showNotification, sendTransaction, connection, clockworkProvider, thread, threadAuthority, threadId, setLoading)
    }, [publicKey, runDataAddress, runDataAccount, thread, threadAuthority, threadId, clockworkProvider])

    return (
        <Button isLoading={isLoading} onClick={startNewRunCallback} isDisabled={cantStartNewRun} mb={5}>Start new run</Button>
    )
}