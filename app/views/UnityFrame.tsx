'use client'

import { Flex, Text, Box, Progress } from "@chakra-ui/react"
import { Unity, useUnityContext } from "react-unity-webgl";
import { useGameContext } from "../contexts/GameContext";

const isBrowser = () => typeof window !== 'undefined';

function getWindowPixelRatio() {
    if (isBrowser()) {
        return window.devicePixelRatio;
    }
    else
        return 1;
}

export const UnityFrame: React.FC = () => {

    const { showGame } = useGameContext()

    const pixelRatio = getWindowPixelRatio()

    const { unityProvider, requestFullscreen, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: "build/extracto.loader.js",
        dataUrl: "build/extracto.data",
        frameworkUrl: "build/extracto.framework.js",
        codeUrl: "build/extracto.wasm",
    });

    function handleClickFullscreen(isFullScreen: boolean) {
        console.log("Go fullscreen");
        requestFullscreen(isFullScreen);
    }

    return (
        <>
        <Flex display={showGame? "flex" : "none"} direction="column" flex={"1 0 0px"} px={0} py={0} alignItems={"center"}>
            <Text mb = {5}>UnityFrame</Text>
            <Box flex={"1 0 0px"} width={"100%"} position={"relative"}>
                <Unity
                    unityProvider={unityProvider}
                    style={{ width: "100%", height: "100%", position: "absolute" }}
                    devicePixelRatio={pixelRatio}
                />
                {isLoaded && <button style={{ right: "20px", top: "20px", position: "absolute" }} className="fullscreen-button" onClick={() => handleClickFullscreen(true)}>Go fullscreen</button>}
                {!isLoaded && <Progress style={{ left: "0px", bottom: "0px", position: "absolute", width:"100%" }} hasStripe value={loadingProgression * 100} size={'sm'}/>}
            </Box>
        </Flex>
        </>
    )
}