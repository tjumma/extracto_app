'use client'

import { Button } from "@chakra-ui/react"
import { useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useSessionWallet } from "@gumhq/react-sdk"
import { useAnchorContext } from "../contexts/AnchorContext"
import { incrementViaSession } from "../functions/incrementViaSession"
import { useGameContext } from "../contexts/GameContext"

export const IncrementViaSession: FC = () => {

    const { publicKey } = useWallet()
    const { program } = useAnchorContext()
    const { counterAddress } = useGameContext()
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)
    const sessionWallet = useSessionWallet();

    const cantIncrementViaSession = (!publicKey || !program || !sessionWallet || !showNotification || sessionWallet.publicKey == null)

    const incrementViaSessionCallback = useCallback(async () => {
        await incrementViaSession(publicKey, program, counterAddress, sessionWallet, showNotification, setLoading)
    }, [publicKey, program, sessionWallet, showNotification])

    return (
        <Button isLoading={isLoading} onClick={incrementViaSessionCallback} isDisabled={cantIncrementViaSession} mb={5}>Increment via session</Button>
    )
}
