'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button, Flex, Text } from "@chakra-ui/react"
import { useEffect, useMemo, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { useAnchorContext } from "../contexts/AnchorContext"

import { PublicKey } from "@solana/web3.js";
import { InitializeCounter } from "../components/InitializeCounter"
import { IncrementCounter } from "../components/IncrementCounter"
import { ResetCounter } from "../components/ResetCounter"
import { StartThread } from "../components/StartThread"
import { Thread } from "@clockwork-xyz/sdk"
import { PauseThread } from "../components/PauseThread"
import { ResumeThread } from "../components/ResumeThread"
import { DeleteThread } from "../components/DeleteThread"

const COUNTER_SEED = "counter";
const THREAD_AUTHORITY_SEED = "thread_authority"
const GAME_COUNTER_THREAD_ID = "game_counter"

export type CounterDataAccount = {
    authority: PublicKey,
    count: number
}

export const ClockworkView: React.FC = () => {

    const { program, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { publicKey } = useWallet()

    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)
    const [threadDataAccount, setThreadDataAccount] = useState<Thread | null>(null)

    const counterAddress = useMemo(() => {
        if (publicKey && program) {
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

    const threadId = GAME_COUNTER_THREAD_ID;

    const [threadAuthority] = useMemo(() => {
        if (publicKey && program) {
            return PublicKey.findProgramAddressSync(
                [anchor.utils.bytes.utf8.encode(THREAD_AUTHORITY_SEED), program.provider.publicKey.toBuffer()],
                program.programId
            );
        }
        else
            return [null];
    }, [publicKey, program])

    const [thread] = useMemo(() => {
        if (clockworkProvider && threadAuthority && threadId)
            return clockworkProvider.getThreadPDA(threadAuthority, threadId);
        else
            return [null];
    }, [clockworkProvider, threadAuthority, threadId])

    useEffect(() => {
        fetchThreadAccount()
    }, [clockworkProvider, thread])

    const fetchThreadAccount = async () => {
        console.log("Fetching thread account...")
        if (!clockworkProvider || !thread) {
            setThreadDataAccount(null)
        }
        else {
            try {
                const threadAccount = await clockworkProvider.getThreadAccount(thread);
                setThreadDataAccount(threadAccount)
            } catch (error) {
                console.log(`Error fetching thread account: ${error}`)
                setThreadDataAccount(null)
            }
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

    useEffect(() => {
        if (!thread) return

        const subscriptionId = connection.onAccountChange(
            thread,
            () => {
                fetchThreadAccount()
            }
        )

        return () => {
            connection.removeAccountChangeListener(subscriptionId)
        }
    }, [connection, thread, program, publicKey])

    return (
        <Flex direction={"row"} px={0} pb={20} pt={10}>
            <Flex direction="column" alignItems={"center"} textAlign={"center"} width="50%">
                <Text mb={5}>{`Counter address: ${counterAddress}`}</Text>
                <Text mb={5}>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
                <Text mb={5}>{`Current thread id: ${counterDataAccount ? threadId : null}`}</Text>
                <Text mb={5}>{`Current thread authority address: ${counterDataAccount ? threadAuthority : null}`}</Text>
                <Text mb={5}>{`Current thread address: ${thread}`}</Text>
                <Text mb={5}>{`thread id: ${threadDataAccount ? threadDataAccount.id : "null"}`}</Text>
                <Text mb={5}>{`thread paused: ${threadDataAccount ? threadDataAccount.paused : "null"}`}</Text>
                <Text mb={5}>{`thread fee: ${threadDataAccount ? threadDataAccount.fee : "null"}`}</Text>
                <Text mb={5}>{`thread name: ${threadDataAccount ? threadDataAccount.name : "null"}`}</Text>
                <Text mb={5}>{`thread created at: ${threadDataAccount ? (new Date(threadDataAccount.createdAt.unixTimestamp * 1000)).toDateString() : "null"}`}</Text>
                <Text mb={5}>{`thread exec since reimb: ${threadDataAccount && threadDataAccount.execContext ? threadDataAccount.execContext.execsSinceReimbursement : "null"}`}</Text>
                <Text mb={5}>{`thread last exec at: ${threadDataAccount && threadDataAccount.execContext ? threadDataAccount.execContext.lastExecAt : "null"}`}</Text>
            </Flex>
            <Flex direction="column" alignItems={"center"} width="50%">
                <InitializeCounter counterAddress={counterAddress} counterDataAccount={counterDataAccount} />
                <IncrementCounter counterAddress={counterAddress} />
                <ResetCounter counterAddress={counterAddress} />
                <StartThread counterAddress={counterAddress} threadId={threadId} threadAuthority={threadAuthority} thread={thread} threadDataAccount={threadDataAccount} />
                <PauseThread threadId={threadId} threadAuthority={threadAuthority} thread={thread} threadDataAccount={threadDataAccount} />
                <ResumeThread threadId={threadId} threadAuthority={threadAuthority} thread={thread} threadDataAccount={threadDataAccount} />
                <DeleteThread threadId={threadId} threadAuthority={threadAuthority} thread={thread} threadDataAccount={threadDataAccount} />

                <Button onClick={fetchCounterAccount} mb={5}>Fetch counter account manually</Button>
                <Button onClick={fetchThreadAccount} mb={5}>Fetch thread account manually</Button>
            </Flex>
        </Flex>
    )
}