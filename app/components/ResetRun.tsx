'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from 'react'
import { useAnchorContext } from "../contexts/AnchorContext"
import { Button } from "@chakra-ui/react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useGameContext } from "../contexts/GameContext"
import { resetRun } from "../functions/resetRun"

export const ResetRun: FC = () => {

    const { runDataAddress } = useGameContext()
    const [isLoading, setLoading] = useState(false)
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const resetRunCallback = useCallback(async () => {
        await resetRun(publicKey, program, runDataAddress, setLoading, sendTransaction, connection, showNotification)
    }, [publicKey, runDataAddress])

    return (
        <Button isLoading={isLoading} onClick={resetRunCallback} isDisabled={!publicKey || !program || !runDataAddress} mb={5}>Reset run</Button>
    )
}