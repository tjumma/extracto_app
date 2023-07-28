'use client'

import { Flex, Text, Box, Progress, Spacer, Center, AbsoluteCenter } from "@chakra-ui/react"
import { Unity, useUnityContext } from "react-unity-webgl";
import { useUnityFrameContext } from "../contexts/UnityFrameContext";
import { useCallback, useEffect, useState } from "react";
import { ReactUnityEventParameter } from "react-unity-webgl/distribution/types/react-unity-event-parameters";
import { useGameContext } from "../contexts/GameContext";
import { useWallet } from "@solana/wallet-adapter-react";

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

export type PlayerData = {
    publicKey: string,
    name: string,
    runsFinished: number,
}

export const UnityFrame: React.FC = () => {

    const { publicKey } = useWallet()
    const { showUnityFrame } = useUnityFrameContext()
    const [pixelRatio, setPixelRatio] = useState(() => getWindowPixelRatio())
    const { playerDataAddress, playerDataAccount, incrementRunCallback, initPlayerCallback } = useGameContext()

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

    useEffect(() => {

        if (playerDataAccount === undefined)
        {
            console.log("UNDEFINED HERE, SKIPPING SENDING TO UNITY")
            return
        }

        const playerData: PlayerData = {
            publicKey: publicKey ? publicKey.toString() : "",
            name: playerDataAccount ? playerDataAccount.name : "",
            runsFinished: playerDataAccount ? playerDataAccount.runsFinished : 0
        }
        console.log("sending PlayerData to Unity")
        console.log(JSON.stringify(playerData))
        sendMessage("ReactToUnity", "OnPlayerUpdated", JSON.stringify(playerData));
    }, [publicKey, playerDataAddress, playerDataAccount])









    //UNITY TO REACT

    function handleGameReady() {
        console.log(`React got GameReady from Unity`);
        const playerData: PlayerData = {
            publicKey: publicKey ? publicKey.toString() : "",
            name: playerDataAccount ? playerDataAccount.name : "",
            runsFinished: playerDataAccount ? playerDataAccount.runsFinished : 0
        }
        console.log("sending PlayerData to Unity")
        console.log(JSON.stringify(playerData))
        sendMessage("ReactToUnity", "OnPlayerUpdated", JSON.stringify(playerData));
        return null;
    };

    useEffect(() => {
        addEventListener("GameReady", handleGameReady);
        return () => {
            removeEventListener("GameReady", handleGameReady);
        };
    }, [addEventListener, removeEventListener, handleIncrementRunFromUnity]);

    function handleIncrementRunFromUnity(message: string) {
        console.log(`React got IncrementRunFromUnity: ${message}`);
        incrementRunCallback();
        return null;
    };

    useEffect(() => {
        addEventListener("IncrementRunFromUnity", handleIncrementRunFromUnity);
        return () => {
            removeEventListener("IncrementRunFromUnity", handleIncrementRunFromUnity);
        };
    }, [addEventListener, removeEventListener, handleIncrementRunFromUnity]);

    function handleInitPlayerFromUnity(playerName: string) {
        console.log(`React got InitPlayerFromUnity: ${playerName}`);
        initPlayerCallback(playerName)
        return null;
    };

    useEffect(() => {
        addEventListener("InitPlayerFromUnity", handleInitPlayerFromUnity);
        return () => {
            removeEventListener("IncrementRunFromUnity", handleInitPlayerFromUnity);
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
                    {!isLoaded && <Progress style={{ left: "0px", bottom: "0px", position: "absolute", width: "100%" }} hasStripe value={loadingProgression * 100} size={'sm'} />}
                </Box>
            </Flex>
        </>
    )
}