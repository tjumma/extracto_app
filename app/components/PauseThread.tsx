'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useGameContext } from '../contexts/GameContext'
import { pauseThread } from '../functions/pauseThread'

export const PauseThread: FC = () => {

    const { threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantPauseThread = (threadDataAccount === null || threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const pauseThreadCallback = useCallback(async () => {
        await pauseThread(publicKey, program, thread, threadId, threadDataAccount, clockworkProvider, threadAuthority, showNotification)
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={pauseThreadCallback} isDisabled={cantPauseThread} mb={5}>Pause thread</Button>
    )
}