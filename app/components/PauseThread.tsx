'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { PublicKey } from '@solana/web3.js'
import { Thread } from '@clockwork-xyz/sdk'

interface Props {
    threadId: string,
    threadAuthority: PublicKey,
    thread: PublicKey,
    threadDataAccount: Thread | null
}

export const PauseThread: FC<Props> = ({ threadId, threadAuthority, thread, threadDataAccount }) => {

    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantPauseThread = (threadDataAccount === null || threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    const pauseThread = useCallback(async () => {

        if (cantPauseThread)
            return

        try {
            await program.methods
                .pauseThread()
                .accounts({
                    user: publicKey,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority,
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread paused!",
                description: `Thread "${threadId}" has been paused`,
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread pause error!",
                description: `${e}`,
            })
        }
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, threadDataAccount])

    return (
        <Button onClick={pauseThread} isDisabled={cantPauseThread} mb={5}>Pause thread</Button>
    )
}