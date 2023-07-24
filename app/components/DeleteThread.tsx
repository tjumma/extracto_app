'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useGameContext } from '../contexts/GameContext'
import { deleteThread } from '../functions/deleteThread'

export const DeleteThread: FC = () => {

    const { threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantDeleteThread = (threadDataAccount === null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const deleteThreadCallback = useCallback(async () => {
        await deleteThread(publicKey, program, clockworkProvider, thread, threadId, threadAuthority, threadDataAccount, showNotification)
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={deleteThreadCallback} isDisabled={cantDeleteThread} mb={5}>Delete thread</Button>
    )
}