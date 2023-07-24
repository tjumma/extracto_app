'use client'

import { Flex, Text } from "@chakra-ui/react"
import { useEffect } from "react";
import { useUnityFrameContext } from "../contexts/UnityFrameContext";

export const GameView: React.FC = () => {

    const { showUnityFrame: showGame, setShowUnityFrame: setShowGame } = useUnityFrameContext()

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