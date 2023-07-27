'use client'

import { FC, useCallback, useState } from "react"
import { Button, Input } from "@chakra-ui/react";
import { useNotificationContext } from "../contexts/NotificationContext";
import { useAnchorContext } from "../contexts/AnchorContext";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGameContext } from "../contexts/GameContext";
import { initializePlayer } from "../functions/initializePlayer";

export const InitializePlayer: FC = () => {

    const { playerDataAddress, playerDataAccount } = useGameContext()
    const { publicKey, sendTransaction } = useWallet()
    const { program } = useAnchorContext()
    const { connection } = useConnection();
    const { showNotification } = useNotificationContext()

    const [isLoading, setLoading] = useState(false)

    const [name, setName] = useState("")
    const handleNameChange = (event) => setName(event.target.value)

    const cantInitializePlayer = (!publicKey || !program || !playerDataAddress || playerDataAccount !== null)

    const initializePlayerCallback = useCallback(async (playerName: string) => {
        await initializePlayer(playerName, publicKey, program, connection, playerDataAddress, playerDataAccount, showNotification, sendTransaction, setLoading)
    }, [publicKey, playerDataAddress, playerDataAccount])

    return (
        <>
            <Input width={"60%"} mb={5} value={name} onChange={handleNameChange} display={!cantInitializePlayer ? "flex" : "none"} placeholder="player name here"/>
            <Button isLoading={isLoading} onClick={() => initializePlayerCallback(name)} isDisabled={cantInitializePlayer} mb={5}>Initialize player</Button>
        </>
    )
}