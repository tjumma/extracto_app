'use client'

import { Button } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useAnchorContext } from '../contexts/AnchorContext'
import { useWallet } from '@solana/wallet-adapter-react'
import { SystemProgram } from "@solana/web3.js";
import { useGameContext } from '../contexts/GameContext'

export const StartThread: FC = () => {

    const { counterAddress, threadId, threadAuthority, thread, threadDataAccount } = useGameContext()
    const { publicKey } = useWallet()
    const { program, clockworkProvider } = useAnchorContext()
    const { showNotification } = useNotificationContext()

    const cantStartNewThread = (threadDataAccount != null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread || !counterAddress)

    const startThread = useCallback(async () => {

        if (cantStartNewThread)
            return

        try {
            await program.methods
                .startThread(Buffer.from(threadId))
                .accounts({
                    user: publicKey,
                    systemProgram: SystemProgram.programId,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority,
                    counter: counterAddress,
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread started!",
                description: `Thread has been started`,
                link: `https://app.clockwork.xyz/threads/${thread}?cluster=custom&clusterUrl=http://localhost:8899`,
                linkText: "Thread"
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread start error!",
                description: `${e}`,
            })
        }
    }, [threadId, publicKey, clockworkProvider, threadAuthority, thread, counterAddress])

    return (
        <Button onClick={startThread} isDisabled={cantStartNewThread} mb={5}>Start thread</Button>
    )
}