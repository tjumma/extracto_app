'use client'

import { Button } from "@chakra-ui/react"
import { useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useSessionWallet } from "@gumhq/react-sdk"
import { revokeSession } from "../functions/revokeSession"

export const RevokeSession: FC = () => {

    const { publicKey } = useWallet()
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)
    const sessionWallet = useSessionWallet();

    const cantRevokeSession = (!publicKey || !sessionWallet || !showNotification || sessionWallet.publicKey === null)

    const revokeSessionCallback = useCallback(async () => {
        await revokeSession(publicKey, sessionWallet, showNotification, setLoading)
    }, [publicKey, sessionWallet, showNotification])

    return (
        <Button isLoading={isLoading} onClick={revokeSessionCallback} isDisabled={cantRevokeSession} mb={5}>Revoke session</Button>
    )
}
