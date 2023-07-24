'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useGameContext } from '../contexts/GameContext'
import { resumeThread } from '../functions/resumeThread'

export const ResumeThread: FC = () => {

    const { threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantResumeThread = (threadDataAccount === null || !threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const resumeThreadCallback = useCallback(async () => {
        await resumeThread(publicKey, program, clockworkProvider, thread, threadDataAccount, threadAuthority, threadId, showNotification)
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={resumeThreadCallback} isDisabled={cantResumeThread} mb={5}>Resume thread</Button>
    )
}