'use client'

import { Flex, Text, Box, Progress, Spacer, Center, AbsoluteCenter } from "@chakra-ui/react"
import { Unity, useUnityContext } from "react-unity-webgl";
import { useGameContext } from "../contexts/GameContext";
import { useEffect, useState } from "react";

const isBrowser = () => typeof window !== 'undefined';

function getWindowPixelRatio() {
    if (isBrowser()) {
        console.log(`updateDevicePixelRatio: ${window.devicePixelRatio}`);
        return window.devicePixelRatio;
    }
    else {
        console.log(`updateDevicePixelRatio: 1`);
        return 1;
    }
}

export const UnityFrame: React.FC = () => {

    const { showGame } = useGameContext()

    const [pixelRatio, setPixelRatio] = useState(() => getWindowPixelRatio())

    useEffect(
        function () {

            const updateDevicePixelRatio = function () {
                var current = getWindowPixelRatio();
                console.log(`updateDevicePixelRatio: ${current}`);
                setPixelRatio(current);
            };

            const mediaMatcher = window.matchMedia(
                `screen and (resolution: ${pixelRatio}dppx)`
            );

            mediaMatcher.addEventListener("change", updateDevicePixelRatio);

            return function () {
                mediaMatcher.removeEventListener("change", updateDevicePixelRatio);
            };
        },
        [pixelRatio]
    );

    const { unityProvider, requestFullscreen, isLoaded, loadingProgression } = useUnityContext({
        loaderUrl: "build/extracto.loader.js",
        dataUrl: "build/extracto.data",
        frameworkUrl: "build/extracto.framework.js",
        codeUrl: "build/extracto.wasm",
        productName: "Extracto",
        productVersion: "0.1.0",
        companyName: "tjumma",
    });

    function handleClickFullscreen(isFullScreen: boolean) {
        console.log("Go fullscreen");
        requestFullscreen(isFullScreen);
    }

    return (
        <>
            <Flex display={showGame ? "flex" : "none"} direction="column" flex={"1 0 0px"} px={0} py={0} alignItems={"center"}>
                {/* <Text mb={5}>UnityFrame</Text> */}
                <Box flex={"1 0 0px"} width={"100%"} position={"relative"}>
                    {!isLoaded && <AbsoluteCenter>
                    <Text>Loading...</Text>
                    </AbsoluteCenter>}
                    <Unity
                        unityProvider={unityProvider}
                        tabIndex={1}
                        style={{ width: "100%", height: "100%", position: "absolute" }}
                        devicePixelRatio={pixelRatio}
                    />
                    {isLoaded && <button style={{ right: "20px", top: "20px", position: "absolute" }} className="fullscreen-button" onClick={() => handleClickFullscreen(true)}>Go fullscreen</button>}
                    {!isLoaded && <Progress style={{ left: "0px", bottom: "0px", position: "absolute", width: "100%" }} hasStripe value={loadingProgression * 100} size={'sm'} />}
                </Box>
            </Flex>
        </>
    )
}