'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useGameContext } from '../contexts/GameContext'
import { startThread } from '../functions/startThread'

export const StartThread: FC = () => {

    const { counterAddress, threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantStartNewThread = (threadDataAccount != null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread || !counterAddress)

    const startThreadCallback = useCallback(async () => {
        await startThread(publicKey, clockworkProvider, threadDataAccount, threadId, threadAuthority, thread, counterAddress, program, showNotification)
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, counterAddress])

    return (
        <Button onClick={startThreadCallback} isDisabled={cantStartNewThread} mb={5}>Start thread</Button>
    )
}