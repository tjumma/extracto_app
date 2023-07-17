'use client'

import * as anchor from "@coral-xyz/anchor"
import { Button, Flex, Text } from "@chakra-ui/react"
import { FC, ReactNode, useCallback, createContext, useContext, useMemo, useEffect } from "react"
import { useWallet, useConnection, useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, } from "@solana/web3.js";

import idl from "../../extracto_program.json"
import { ExtractoProgram, IDL } from "../../extracto_program"

const COUNTER_SEED = "counter_1";

export const ClockworkView: React.FC = () => {

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()
    const { publicKey } = useWallet()

    const provider = useMemo(() => new anchor.AnchorProvider(connection, anchorWallet as AnchorWallet, {})
        , [connection, anchorWallet])

    useEffect(() => {
        anchor.setProvider(provider)
    }, [provider])

    const programId = new anchor.web3.PublicKey(idl.metadata.address)
    const program = new anchor.Program<ExtractoProgram>(IDL, programId, provider);

    const [counterAddress] = PublicKey.findProgramAddressSync(
        [anchor.utils.bytes.utf8.encode(COUNTER_SEED)],
        program.programId
    );

    console.log(`Counter address: ${counterAddress}`)

    const fetchData = useCallback(async () => {
        console.log("Fetching counter account...")
        if (counterAddress) {
            try {
                const account = await program.account.counter.fetch(counterAddress)
                console.log(account.count.toString())
                // setGameDataAccount(account)
            } catch (error) {
                console.log(`Error fetching counter state: ${error}`)
                // setGameDataAccount(null)
            }
        }
        else {
            // setGameDataAccount(null)
        }
    }, [])

    const initialize = useCallback(async () => {
        console.log("Initialize");

        try {
            const txHash = await program.methods
                .initialize()
                .accounts({
                    counter: counterAddress,
                    user: publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc()

            console.log(txHash)
        }
        catch (e) {
            console.log(e)
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

            console.log(txHash)
        }
        catch (e) {
            console.log(e)
        }
    }, [counterAddress, publicKey])

    return (
        <Flex direction="column" px={0} py={0} alignItems={"center"}>
            <Text mt={10} mb={10}>ClockworkView</Text>
            <Button onClick={initialize} mb={5}>Initialize</Button>
            <Button onClick={increment} mb={5}>Increment</Button>
            <Button onClick={fetchData}>Fetch</Button>
        </Flex>
    )
}