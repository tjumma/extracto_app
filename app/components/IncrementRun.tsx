'use client'

import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useGameContext } from "../contexts/GameContext"
import { incrementRun } from "../functions/incrementRun"

export const IncrementRun: FC = () => {

    const { runDataAddress, runDataAccount, playerDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const cantIncrementRun = (!publicKey || !program || !runDataAddress || !runDataAccount || !playerDataAccount || !playerDataAccount.isInRun)

    const incrementRunCallback = useCallback(async () => {
        await incrementRun(publicKey, program, playerDataAccount, runDataAddress, runDataAccount, sendTransaction, connection, showNotification, setLoading)
    }, [publicKey, runDataAddress, runDataAccount, playerDataAccount])

    return (
        <Button isLoading={isLoading} onClick={incrementRunCallback} isDisabled={cantIncrementRun} mb={5}>Increment manually</Button>
    )
}