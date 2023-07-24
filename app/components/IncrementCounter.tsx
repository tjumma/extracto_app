'use client'

import { Button } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useGameContext } from "../contexts/GameContext"
import { incrementCounter } from "../functions/incrementCounter"

export const IncrementCounter: FC = () => {

    const { counterAddress } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const incrementCounterCallback = useCallback(async () => {
        await incrementCounter(publicKey, program, counterAddress, setLoading, sendTransaction, connection, showNotification)
    }, [publicKey, counterAddress])

    return (
        <Button isLoading={isLoading} onClick={incrementCounterCallback} isDisabled={!publicKey || !program || !counterAddress} mb={5}>Increment manually</Button>
    )
}