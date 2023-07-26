'use client'

import { Button } from "@chakra-ui/react"
import { useWallet } from "@solana/wallet-adapter-react"
import { FC, useCallback, useState } from "react"
import { useNotificationContext } from "../contexts/NotificationContext"
import { useSessionWallet } from "@gumhq/react-sdk"
import { useAnchorContext } from "../contexts/AnchorContext"
import { createSession } from "../functions/createSession"

export const CreateSession: FC = () => {

    const { publicKey } = useWallet()
    const { program } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)
    const sessionWallet = useSessionWallet();

    const cantCreateSession = (!publicKey || !program || !sessionWallet || !showNotification || sessionWallet.publicKey !== null)

    const createSessionCallback = useCallback(async () => {
        await createSession(publicKey, program, sessionWallet, showNotification, setLoading)
    }, [publicKey, program, sessionWallet, showNotification])

    return (
        <Button isLoading={isLoading} onClick={createSessionCallback} isDisabled={cantCreateSession} mb={5}>Create session</Button>
    )
}
