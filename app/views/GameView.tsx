'use client'

import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { useGameContext } from "../contexts/GameContext";

export const GameView: React.FC = () => {

    const { showGame, setShowGame } = useGameContext()

    useEffect(() => {
        setShowGame(true)

        return () => {
            setShowGame(false)
        }
    }, []);

    return (
        // <Flex direction = "column" px={0} py={0} alignItems={"center"}>
        //     <Text>GameView</Text>
        // </Flex>
        <>
        </>
    )
}