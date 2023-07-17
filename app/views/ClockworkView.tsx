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
    const { publicKey } = useWallet()

    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)

    const fetchData = useCallback(async () => {
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
    }, [])

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
                const txHash = await program.methods
                    .initialize()
                    .accounts({
                        counter: counterAddress,
                        user: publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .rpc()

                showNotification({
                    status: "success",
                    title: "Counter initialized!",
                    description: `Counter account initialized`,
                    link: `https://solana.fm/tx/${txHash}?cluster=http://localhost:8899`,
                    linkText: "Transaction"
                })
            }
            catch (e) {
                console.log(e)
                showNotification({
                    status: "error",
                    title: "Initialize error!",
                    description: `${e}`,
                })
            }
        }
    }, [counterAddress, publicKey])

    const increment = useCallback(async () => {
        console.log("Increment");

        try {
            const txHash = await program.methods
                .increment()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                })
                .rpc()

            showNotification({
                status: "success",
                title: "Counter incremented!",
                description: `Counter account incremented`,
                link: `https://solana.fm/tx/${txHash}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
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
            const txHash = await program.methods
                .reset()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                })
                .rpc()

            showNotification({
                status: "success",
                title: "Counter reset!",
                description: `Counter has been reset`,
                link: `https://solana.fm/tx/${txHash}?cluster=http://localhost:8899`,
                linkText: "Transaction"
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Reset error!",
                description: `${e}`,
            })
        }
    }, [counterAddress, publicKey])

    useEffect(() => {
        fetchData()
    }, [publicKey])

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
            <Button onClick={initialize} isDisabled={!publicKey} mb={5}>Initialize counter account</Button>
            <Button onClick={increment} isDisabled={!publicKey} mb={5}>Increment manually</Button>
            <Button onClick={reset} isDisabled={!publicKey} mb={5}>Reset counter</Button>
            <Button onClick={fetchData} mb={5}>Fetch counter account manually</Button>
            <Text>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
        </Flex>
    )
}