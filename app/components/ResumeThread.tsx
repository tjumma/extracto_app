'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useGameContext } from '../contexts/GameContext'

export const ResumeThread: FC = () => {

    const { threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantResumeThread = (threadDataAccount === null || !threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const resumeThread = useCallback(async () => {

        if (cantResumeThread)
            return

        try {
            await program.methods
                .resumeThread()
                .accounts({
                    user: publicKey,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority,
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread resumed!",
                description: `Thread "${threadId}" has been resumed`,
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread resume error!",
                description: `${e}`,
            })
        }
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={resumeThread} isDisabled={cantResumeThread} mb={5}>Resume thread</Button>
    )
}