'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button, Flex, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"

import { PublicKey, SystemProgram, } from "@solana/web3.js";
import { InitializeCounter } from "../components/InitializeCounter"
import { IncrementCounter } from "../components/IncrementCounter"
import { ResetCounter } from "../components/ResetCounter"

const COUNTER_SEED = "counter";
const THREAD_AUTHORITY_SEED = "thread_authority"
const GAME_COUNTER_ID = "game_counter"

export type CounterDataAccount = {
    authority: PublicKey,
    count: number
}

export const ClockworkView: React.FC = () => {

    const { showNotification } = useNotificationContext()

    const { program, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet()

    const [isResetLoading, setIsResetLoading] = useState(false)

    // const [counterAddress, setCounterAddress] = useState<anchor.web3.PublicKey | null>(null)
    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)

    const [threadId, setThreadId] = useState<string | null>(null)
    const [threadAuthority, setThreadAuthority] = useState<PublicKey | null>(null)
    const [thread, setThread] = useState<PublicKey | null>(null)

    const counterAddress = useMemo(() => {
        if (program && publicKey) {
            const [newCounterAddress, _bump] = PublicKey.findProgramAddressSync(
                [anchor.utils.bytes.utf8.encode(COUNTER_SEED), program.provider.publicKey.toBuffer()],
                program.programId
            );

            return newCounterAddress;
        }
        else {
            return null;
        }
    }, [publicKey, program])

    useEffect(() => {
        fetchCounterAccount();
    }, [counterAddress])

    const fetchCounterAccount = async () => {
        console.log("Fetching counter account...")
        if (counterAddress) {
            try {
                const newCounterAccount = await program.account.counter.fetch(counterAddress)
                setCounterDataAccount(newCounterAccount)
                console.log(newCounterAccount.count)
            } catch (error) {
                console.log(`Error fetching counter state: ${error}`)
                setCounterDataAccount(null)
            }
        }
        else {
            console.log("no counter address yet")
            setCounterDataAccount(null)
        }
    };

    const startThread = async () => {

        // const newThreadId = "counter-" + new Date().getTime() / 1000;
        const newThreadId = GAME_COUNTER_ID;

        console.log(`threadId: ${newThreadId}`)

        //get threadAuthority PDA address from seed
        const [newThreadAuthorityAddress] = PublicKey.findProgramAddressSync(
            [anchor.utils.bytes.utf8.encode(THREAD_AUTHORITY_SEED), program.provider.publicKey.toBuffer()], // 👈 make sure it matches on the prog side
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
                    user: publicKey,
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
    }

    const resumeThread = async () => {
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
    }

    const deleteThread = async () => {

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
                <Text mb={5} textAlign={"center"}>{`Counter address: ${counterAddress}`}</Text>
                <Text mb={5}>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
                <Text mb={5}>{`Current thread id: ${counterDataAccount ? threadId : null}`}</Text>
                <Text mb={5}>{`Current thread authority address: ${counterDataAccount ? threadAuthority : null}`}</Text>
            </Flex>
            <Flex direction="column" alignItems={"center"} width="50%">
                <InitializeCounter counterAddress={counterAddress} counterDataAccount={counterDataAccount} />
                <IncrementCounter counterAddress={counterAddress} />
                <ResetCounter counterAddress={counterAddress} />
                <Button onClick={startThread} isDisabled={!publicKey || !!thread} mb={5}>Start thread</Button>
                <Button onClick={pauseThread} isDisabled={!publicKey || !thread} mb={5}>Pause thread</Button>
                <Button onClick={resumeThread} isDisabled={!publicKey || !thread} mb={5}>Resume thread</Button>
                <Button onClick={deleteThread} isDisabled={!publicKey || !thread} mb={5}>Delete thread</Button>
                <Button onClick={fetchCounterAccount} mb={5}>Fetch counter account manually</Button>
            </Flex>
        </Flex>
    )
}