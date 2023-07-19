'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button, Flex, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"

import { PublicKey, SystemProgram, } from "@solana/web3.js";

const THREAD_AUTHORITY_SEED = "thread_authority"

type CounterDataAccount = {
    count: number
}

export const ClockworkView: React.FC = () => {

    const { showNotification } = useNotificationContext()

    const { program, counterAddress, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet()

    const [isInitializeLoading, setIsInitializeLoading] = useState(false)
    const [isIncrementLoading, setIsIncrementLoading] = useState(false)
    const [isResetLoading, setIsResetLoading] = useState(false)

    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)

    const [threadId, setThreadId] = useState<string | null>(null)
    const [threadAuthority, setThreadAuthority] = useState<PublicKey | null>(null)
    const [thread, setThread] = useState<PublicKey | null>(null)

    const startThread = async () => {

        const newThreadId = "counter-" + new Date().getTime() / 1000;

        console.log(`threadId: ${newThreadId}`)

        //get threadAuthority PDA address from seed
        const [newThreadAuthorityAddress] = PublicKey.findProgramAddressSync(
            [anchor.utils.bytes.utf8.encode(THREAD_AUTHORITY_SEED)], // 👈 make sure it matches on the prog side
            program.programId
        );

        //derive threadAddress from threadAuthority and threadId
        const [newThreadAddress] = clockworkProvider.getThreadPDA(newThreadAuthorityAddress, newThreadId)

        try {
            // 2️⃣ Ask our program to create a thread via CPI
            // and thus become the admin of that thread
            await program.methods
                .startThread(Buffer.from(newThreadId))
                .accounts({
                    payer: publicKey,
                    systemProgram: SystemProgram.programId,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: newThreadAddress,
                    threadAuthority: newThreadAuthorityAddress,
                    counter: counterAddress,
                })
                .rpc();

            setThreadId(newThreadId)
            setThreadAuthority(newThreadAuthorityAddress)
            setThread(newThreadAddress)

            showNotification({
                status: "success",
                title: "Thread started!",
                description: `Thread has been started`,
                link: `https://app.clockwork.xyz/threads/${newThreadAddress}?cluster=custom&clusterUrl=http://localhost:8899`,
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
    }

    const pauseThread = async () => {
        try {
            await program.methods
                .pauseThread()
                .accounts({
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
    }

    const resumeThread = async () => {
        try {
            await program.methods
                .resumeThread()
                .accounts({
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
    }

    const deleteThread = async () => {

        try {
            await program.methods
                .deleteThread()
                .accounts({
                    payer: publicKey,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority
                })
                .rpc();

            setThreadId(null)
            setThreadAuthority(null)
            setThread(null)

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
    }

    useEffect(() => {
        console.log("FETCHING DATA ON MOUNT!")
        fetchData()
    }, [publicKey])

    const fetchData = async () => {
        console.log("Fetching counter account...")
        if (counterAddress) {
            try {
                const counterAccount = await program.account.counter.fetch(counterAddress)
                console.log(counterAccount.count.toString())
                setCounterDataAccount(counterAccount)
            } catch (error) {
                console.log(`Error fetching counter state: ${error}`)
                setCounterDataAccount(null)
            }
        }
        else {
            setCounterDataAccount(null)
        }
    }

    const initialize = useCallback(async () => {
        console.log("Initialize");

        if (counterDataAccount) {
            console.log("Counter account is already initialized");

            showNotification({
                status: "info",
                title: "Already initialized!",
                description: `Counter account is already initialized`,
                link: `https://solana.fm/address/${counterAddress}?cluster=http://localhost:8899`,
                linkText: "Counter account"
            })
        }
        else {
            try {
                setIsInitializeLoading(true)

                const tx = await program.methods
                    .initialize()
                    .accounts({
                        counter: counterAddress,
                        user: publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .transaction()

                const txSig = await sendTransaction(tx, connection, {
                    skipPreflight: true,
                })

                const latestBlockHash = await connection.getLatestBlockhash();

                await connection.confirmTransaction({
                    blockhash: latestBlockHash.blockhash,
                    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                    signature: txSig,
                })

                setIsInitializeLoading(false)

                showNotification({
                    status: "success",
                    title: "Counter initialized!",
                    description: `Counter account initialized`,
                    link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                    linkText: "Transaction"
                })
            }
            catch (e) {
                setIsInitializeLoading(false)

                showNotification({
                    status: "error",
                    title: "Initialize error!",
                    description: `${e}`,
                })
            }
        }
    }, [counterAddress, publicKey, counterDataAccount])

    const increment = useCallback(async () => {
        console.log("Increment");

        try {
            setIsIncrementLoading(true)

            const tx = await program.methods
                .increment()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                })
                .transaction()

            const txSig = await sendTransaction(tx, connection, {
                skipPreflight: true,
            })

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txSig,
            })

            setIsIncrementLoading(false)

            showNotification({
                status: "success",
                title: "Counter incremented!",
                description: `Counter account incremented`,
                link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
            setIsIncrementLoading(false)

            showNotification({
                status: "error",
                title: "Increment error!",
                description: `${e}`,
            })
        }
    }, [counterAddress, publicKey])

    const reset = useCallback(async () => {
        console.log("Reset");

        try {
            setIsResetLoading(true)

            const tx = await program.methods
                .reset()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                })
                .transaction()

            const txSig = await sendTransaction(tx, connection, {
                skipPreflight: true,
            })

            const latestBlockHash = await connection.getLatestBlockhash();

            await connection.confirmTransaction({
                blockhash: latestBlockHash.blockhash,
                lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
                signature: txSig,
            })

            setIsResetLoading(false)

            showNotification({
                status: "success",
                title: "Counter reset!",
                description: `Counter has been reset`,
                link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
            setIsResetLoading(false)

            showNotification({
                status: "error",
                title: "Reset error!",
                description: `${e}`,
            })
        }
    }, [counterAddress, publicKey])

    useEffect(() => {
        if (!counterAddress) return

        const subscriptionId = connection.onAccountChange(
            counterAddress,
            (counterAccountInfo) => {
                const decodedAccount = program.coder.accounts.decode(
                    "counter",
                    counterAccountInfo.data
                )
                console.log("Got new counter via socket:", decodedAccount.count.toString())
                setCounterDataAccount(decodedAccount)
            }
        )

        return () => {
            connection.removeAccountChangeListener(subscriptionId)
        }
    }, [connection, counterAddress, program, publicKey])

    return (
        <Flex direction={"row"} px={0} pb={20} pt={10}>
            <Flex direction="column" alignItems={"center"} width="50%">
                <Text mb={5}>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
                <Text mb={5}>{`Current thread id: ${threadId}`}</Text>
                <Text mb={5}>{`Current thread authority address: ${threadAuthority}`}</Text>
            </Flex>
            <Flex direction="column" alignItems={"center"} width="50%">
                <Button isLoading={isInitializeLoading} onClick={initialize} isDisabled={!publicKey} mb={5}>Initialize counter account</Button>
                <Button isLoading={isIncrementLoading} onClick={increment} isDisabled={!publicKey} mb={5}>Increment manually</Button>
                <Button isLoading={isResetLoading} onClick={reset} isDisabled={!publicKey} mb={5}>Reset counter</Button>
                <Button onClick={startThread} isDisabled={!publicKey || !!thread} mb={5}>Start thread</Button>
                <Button onClick={pauseThread} isDisabled={!publicKey || !thread} mb={5}>Pause thread</Button>
                <Button onClick={resumeThread} isDisabled={!publicKey || !thread} mb={5}>Resume thread</Button>
                <Button onClick={deleteThread} isDisabled={!publicKey || !thread} mb={5}>Delete thread</Button>
                <Button onClick={fetchData} mb={5}>Fetch counter account manually</Button>
            </Flex>
        </Flex>
    )
}