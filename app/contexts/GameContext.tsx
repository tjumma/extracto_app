'use client'

import * as anchor from "@coral-xyz/anchor"
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAnchorContext } from "./AnchorContext";
import { Thread } from "@clockwork-xyz/sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { incrementCounter } from "../functions/incrementCounter";
import { useNotificationContext } from "./NotificationContext";
import { initializePlayer } from "../functions/initializePlayer";

const PLAYER_SEED = "player";
const COUNTER_SEED = "counter";
const THREAD_AUTHORITY_SEED = "thread_authority"
const GAME_COUNTER_THREAD_ID = "game_counter"

export type PlayerDataAccount = {
    authority: PublicKey,
    name: string,
    runsFinished: number,
}

export type CounterDataAccount = {
    authority: PublicKey,
    count: anchor.BN,
}

export interface GameContextState {
    publicKey: PublicKey,
    playerDataAddress: anchor.web3.PublicKey,
    playerDataAccount: PlayerDataAccount | null | undefined,
    counterAddress: anchor.web3.PublicKey,
    counterDataAccount: CounterDataAccount | null,
    threadId: string,
    threadAuthority: PublicKey,
    thread: PublicKey,
    threadDataAccount: Thread | null,
    incrementCounterCallback: () => Promise<void>,
    initPlayerCallback: (playerName: string) => Promise<void>
}

export const GameContext = createContext<GameContextState>({} as GameContextState);

export function useGameContext(): GameContextState {
    return useContext(GameContext);
}

export const GameContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const { program, clockworkProvider } = useAnchorContext()
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet()
    const { showNotification } = useNotificationContext()

    const [playerDataAccount, setPlayerDataAccount] = useState<PlayerDataAccount | null | undefined>()
    if (playerDataAccount === undefined)
        {
            console.log("UNDEFINED in context, SKIPPING SENDING TO UNITY")
        }
        else {
            console.log("not UNDEFINED even here")
        }
    const [counterDataAccount, setCounterDataAccount] = useState<CounterDataAccount | null>(null)
    const [threadDataAccount, setThreadDataAccount] = useState<Thread | null>(null)

    const playerDataAddress = useMemo(() => {
        if (publicKey && program) {
            const [newPlayerDataAddress, _bump] = PublicKey.findProgramAddressSync(
                [anchor.utils.bytes.utf8.encode(PLAYER_SEED), program.provider.publicKey.toBuffer()],
                program.programId
            );

            return newPlayerDataAddress;
        }
        else {
            return null;
        }
    }, [publicKey, program])

    useEffect(() => {
        fetchPlayerDataAccount();
    }, [playerDataAddress])

    const fetchPlayerDataAccount = async () => {
        console.log("Fetching PlayerData account...")
        if (playerDataAddress) {
            try {
                const newPlayerDataAccount = await program.account.playerData.fetch(playerDataAddress)
                setPlayerDataAccount(newPlayerDataAccount)
            } catch (error) {
                console.log(`Error fetching PlayerData account: ${error}`)
                setPlayerDataAccount(null)
            }
        }
    };

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

    useEffect(() => {
        if (!playerDataAddress) return

        const subscriptionId = connection.onAccountChange(
            playerDataAddress,
            (playerDataAccountInfo) => {
                const decodedAccount = program.coder.accounts.decode(
                    "playerData",
                    playerDataAccountInfo.data
                )
                console.log("Got new PlayerData via socket")
                setPlayerDataAccount(decodedAccount)
            }
        )

        return () => {
            connection.removeAccountChangeListener(subscriptionId)
        }
    }, [connection, playerDataAddress, program, publicKey])

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

    const incrementCounterFromUnity = useCallback(async () => {
        await incrementCounter(publicKey, program, counterAddress, sendTransaction, connection, showNotification)
    }, [publicKey, counterAddress])

    const initPlayerFromUnity = useCallback(async (playerName: string) => {
        await initializePlayer(playerName, publicKey, program, connection, playerDataAddress, playerDataAccount, showNotification, sendTransaction)
    }, [publicKey, playerDataAddress, playerDataAccount])

    return (
        <GameContext.Provider value={{
            publicKey,
            playerDataAddress,
            playerDataAccount,
            counterAddress,
            counterDataAccount,
            threadId,
            threadAuthority,
            thread,
            threadDataAccount,
            incrementCounterCallback: incrementCounterFromUnity,
            initPlayerCallback: initPlayerFromUnity
        }}>
            {children}
        </GameContext.Provider>
    )
}