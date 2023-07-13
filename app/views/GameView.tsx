'use client'

import { Container, Flex, Text, Box } from "@chakra-ui/react"
import { Fragment } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export const GameView: React.FC = () => {

    const { unityProvider } = useUnityContext({
        loaderUrl: "build/extracto.loader.js",
        dataUrl: "build/extracto.data",
        frameworkUrl: "build/extracto.framework.js",
        codeUrl: "build/extracto.wasm",
    });

    return (
        <Flex backgroundColor={"green"} direction="column" flex={"1 0 0px"} px={0} py={0} alignItems={"center"}>
            <Text>GameView</Text>
            <Text>GameView</Text>
            <Box backgroundColor={"red"} flex={"1 0 0px"} width={"100%"} position={"relative"}>
                <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%", position: "absolute"}} />
            </Box>
        </Flex>
    )
}