'use client'

import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from 'react'
import { useAnchorContext } from "../contexts/AnchorContext"
import { Button } from "@chakra-ui/react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useGameContext } from "../contexts/GameContext"
import { resetCounter } from "../functions/resetCounter"

export const ResetCounter: FC = () => {

    const { counterAddress } = useGameContext()
    const [isLoading, setLoading] = useState(false)
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const reset = useCallback(async () => {
        await resetCounter(publicKey, program, counterAddress, setLoading, sendTransaction, connection, showNotification)
    }, [publicKey, counterAddress])

    return (
        <Button isLoading={isLoading} onClick={reset} isDisabled={!publicKey || !program || !counterAddress} mb={5}>Reset counter</Button>
    )
}