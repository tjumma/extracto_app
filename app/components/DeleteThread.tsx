'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useGameContext } from '../contexts/GameContext'

export const DeleteThread: FC = () => {

    const { threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantDeleteThread = (threadDataAccount === null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const deleteThread = useCallback(async () => {

        if (cantDeleteThread)
            return

        try {
            await program.methods
                .deleteThread()
                .accounts({
                    user: publicKey,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread deleted!",
                description: `Thread "${threadId}" has been deleted`,
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread delete error!",
                description: `${e}`,
            })
        }
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={deleteThread} isDisabled={cantDeleteThread} mb={5}>Delete thread</Button>
    )
}