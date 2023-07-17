'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button, Flex, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"

import { useAnchorContext } from "../contexts/AnchorContext"
import { useNotificationContext } from "../contexts/NotificationContext"

type CounterDataAccount = {
    count: number
}

export const ClockworkView: React.FC = () => {

    const { showNotification } = useNotificationContext()

    const { program, counterAddress } = useAnchorContext()
    const { connection } = useConnection();
    const { publicKey, sendTransaction, signTransaction } = useWallet()

    const [isInitializeLoading, setIsInitializeLoading] = useState(false)
    const [isIncrementLoading, setIsIncrementLoading] = useState(false)
    const [isResetLoading, setIsResetLoading] = useState(false)

    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)

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
        <Flex direction="column" px={0} py={0} alignItems={"center"}>
            <Text mt={10} mb={10}>ClockworkView</Text>
            <Button isLoading={isInitializeLoading} onClick={initialize} isDisabled={!publicKey} mb={5}>Initialize counter account</Button>
            <Button isLoading={isIncrementLoading} onClick={increment} isDisabled={!publicKey} mb={5}>Increment manually</Button>
            <Button isLoading={isResetLoading} onClick={reset} isDisabled={!publicKey} mb={5}>Reset counter</Button>
            <Button onClick={fetchData} mb={5}>Fetch counter account manually</Button>
            <Text>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
        </Flex>
    )
}