'use client'

import * as anchor from "@coral-xyz/anchor"
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAnchorContext } from "./AnchorContext";
import { Thread } from "@clockwork-xyz/sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useNotificationContext } from "./NotificationContext";
import { initializePlayer } from "../functions/initializePlayer";
import { incrementRun } from "../functions/incrementRun";
import { startNewRun } from "../functions/startNewRun";
import { finishRun } from "../functions/finishRun";

const PLAYER_SEED = "player";
const RUN_SEED = "run";
const THREAD_AUTHORITY_SEED = "thread_authority"
const GAME_RUN_THREAD_ID = "game_run"

export type PlayerDataAccount = {
    authority: PublicKey,
    name: string,
    runsFinished: number,
    bestScore: anchor.BN,
    isInRun: boolean
}

export type RunDataAccount = {
    authority: PublicKey,
    score: anchor.BN,
}

export interface GameContextState {
    publicKey: PublicKey,
    playerDataAddress: anchor.web3.PublicKey,
    playerDataAccount: PlayerDataAccount | null | undefined,
    runDataAddress: anchor.web3.PublicKey,
    runDataAccount: RunDataAccount | null,
    threadId: string,
    threadAuthority: PublicKey,
    thread: PublicKey,
    threadDataAccount: Thread | null,
    initPlayerCallback: (playerName: string) => Promise<void>
    startNewRunCallback: () => Promise<void>,
    finishRunCallback: () => Promise<void>,
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
    const [runDataAccount, setRunDataAccount] = useState<RunDataAccount | null>(null)
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

    const runDataAddress = useMemo(() => {
        if (publicKey && program) {
            const [newRunAddress, _bump] = PublicKey.findProgramAddressSync(
                [anchor.utils.bytes.utf8.encode(RUN_SEED), program.provider.publicKey.toBuffer()],
                program.programId
            );

            return newRunAddress;
        }
        else {
            return null;
        }
    }, [publicKey, program])

    useEffect(() => {
        fetchRunAccount();
    }, [runDataAddress])

    const fetchRunAccount = async () => {
        console.log("Fetching run account...")
        if (runDataAddress) {
            try {
                const newRunAccount = await program.account.runData.fetch(runDataAddress)
                setRunDataAccount(newRunAccount)
            } catch (error) {
                console.log(`Error fetching run state: ${error}`)
                setRunDataAccount(null)
            }
        }
        else {
            console.log("no run address yet")
            setRunDataAccount(null)
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

    const threadId = GAME_RUN_THREAD_ID;

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
        if (!runDataAddress) return

        const subscriptionId = connection.onAccountChange(
            runDataAddress,
            (runAccountInfo) => {
                const decodedAccount = program.coder.accounts.decode(
                    "runData",
                    runAccountInfo.data
                )
                console.log("Got new run score via socket:", decodedAccount.score.toString())
                setRunDataAccount(decodedAccount)
            }
        )

        return () => {
            connection.removeAccountChangeListener(subscriptionId)
        }
    }, [connection, runDataAddress, program, publicKey])

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

    const initPlayerFromUnity = useCallback(async (playerName: string) => {
        await initializePlayer(playerName, publicKey, program, connection, playerDataAddress, playerDataAccount, runDataAddress, runDataAccount, showNotification, sendTransaction)
    }, [publicKey, playerDataAddress, playerDataAccount, runDataAddress, runDataAccount])

    const startNewRunCallback = useCallback(async () => {
        await startNewRun(publicKey, program, playerDataAccount, runDataAddress, runDataAccount, playerDataAddress, showNotification, sendTransaction, connection, clockworkProvider, thread, threadAuthority, threadId)
    }, [publicKey, runDataAddress, runDataAccount, thread, threadAuthority, threadId, clockworkProvider])

    const finishRunCallback = useCallback(async () => {
        await finishRun(publicKey, program, runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, showNotification, sendTransaction, connection, clockworkProvider, thread, threadAuthority)
    }, [publicKey, runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, threadId, clockworkProvider, threadAuthority, thread, threadDataAccount, showNotification])

    return (
        <GameContext.Provider value={{
            publicKey,
            playerDataAddress,
            playerDataAccount,
            runDataAddress: runDataAddress,
            runDataAccount,
            threadId,
            threadAuthority,
            thread,
            threadDataAccount,
            initPlayerCallback: initPlayerFromUnity,
            startNewRunCallback: startNewRunCallback,
            finishRunCallback: finishRunCallback
        }}>
            {children}
        </GameContext.Provider>
    )
}