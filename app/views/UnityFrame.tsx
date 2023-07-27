'use client'

import { Flex, Text, Box, Progress, Spacer, Center, AbsoluteCenter } from "@chakra-ui/react"
import { Unity, useUnityContext } from "react-unity-webgl";
import { useUnityFrameContext } from "../contexts/UnityFrameContext";
import { useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { useGameContext } from "../contexts/GameContext";

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

    const { showUnityFrame } = useUnityFrameContext()
    const [pixelRatio, setPixelRatio] = useState(() => getWindowPixelRatio())
    const { playerDataAccount, incrementCounterCallback, initPlayerCallback } = useGameContext()

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

    const { unityProvider, requestFullscreen, isLoaded, loadingProgression, sendMessage, addEventListener, removeEventListener } = useUnityContext({
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


    //REACT TO UNITY

    function handleSendMessageToUnity(message: string) {
        sendMessage("ReactToUnity", "OnWalletConnected", message);
    }

    useEffect(() => {
        console.log(`JSON: ${JSON.stringify(playerDataAccount)}`)
        sendMessage("ReactToUnity", "OnPlayerDataUpdated", JSON.stringify(playerDataAccount));
    }, [playerDataAccount])












    //UNITY TO REACT

    function handleGameReady() {
        console.log(`React got GameReady from Unity`);
        sendMessage("ReactToUnity", "OnPlayerDataUpdated", JSON.stringify(playerDataAccount));
        return null;
    };

    useEffect(() => {
        addEventListener("GameReady", handleGameReady);
        return () => {
            removeEventListener("GameReady", handleGameReady);
        };
    }, [addEventListener, removeEventListener, handleIncrementCounterFromUnity]);

    function handleIncrementCounterFromUnity(message: string) {
        console.log(`React got IncrementCounterFromUnity: ${message}`);
        incrementCounterCallback();
        return null;
    };

    useEffect(() => {
        addEventListener("IncrementCounterFromUnity", handleIncrementCounterFromUnity);
        return () => {
            removeEventListener("IncrementCounterFromUnity", handleIncrementCounterFromUnity);
        };
    }, [addEventListener, removeEventListener, handleIncrementCounterFromUnity]);

    function handleInitPlayerFromUnity(playerName: string) {
        console.log(`React got InitPlayerFromUnity: ${playerName}`);
        initPlayerCallback(playerName)
        return null;
    };

    useEffect(() => {
        addEventListener("InitPlayerFromUnity", handleInitPlayerFromUnity);
        return () => {
            removeEventListener("IncrementCounterFromUnity", handleInitPlayerFromUnity);
        };
    }, [addEventListener, removeEventListener, handleInitPlayerFromUnity]);

    return (
        <>
            <Flex display={showUnityFrame ? "flex" : "none"} direction="column" flex={"1 0 0px"} px={0} py={0} alignItems={"center"}>
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
                    {isLoaded && <button style={{ right: "20px", bottom: "20px", position: "absolute" }} className="fullscreen-button" onClick={() => handleSendMessageToUnity("some publicKey")}>Send message to Unity</button>}
                    {!isLoaded && <Progress style={{ left: "0px", bottom: "0px", position: "absolute", width: "100%" }} hasStripe value={loadingProgression * 100} size={'sm'} />}
                </Box>
            </Flex>
        </>
    )
}