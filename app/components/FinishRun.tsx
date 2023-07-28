'use client'

import { FC, useCallback, useState } from "react"
import { Button } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { finishRun } from "../functions/finishRun"

export const FinishRun: FC = () => {

    const { runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantFinishRun = (!publicKey || !program || !runDataAddress || !runDataAccount || !playerDataAddress || !playerDataAccount || !playerDataAccount.isInRun || threadDataAccount === null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const finishRunCallback = useCallback(async () => {
        await finishRun(publicKey, program, runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, showNotification, sendTransaction, connection, clockworkProvider, thread, threadAuthority, setLoading)
    }, [publicKey, runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, threadId, clockworkProvider, threadAuthority, thread, threadDataAccount, showNotification])

    return (
        <Button isLoading={isLoading} onClick={finishRunCallback} isDisabled={cantFinishRun} mb={5}>Finish run</Button>
    )
}