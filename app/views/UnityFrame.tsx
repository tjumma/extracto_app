'use client'

import { Flex, Text, Box, Progress, Spacer, Center, AbsoluteCenter } from "@chakra-ui/react"
import { Unity, useUnityContext } from "react-unity-webgl";
import { useUnityFrameContext } from "../contexts/UnityFrameContext";
import { useEffect, useState } from "react";
import { CharacterInfo, useGameContext } from "../contexts/GameContext";
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

export type PlayerDataForUnity = {
    publicKey: string,
    name: string,
    runsFinished: number,
    bestScore: number,
    isInRun: boolean
}

export type RunDataForUnity = {
    score: number,
    slots: CharacterInfo[]
}

export const UnityFrame: React.FC = () => {

    const { publicKey } = useWallet()
    const { showUnityFrame } = useUnityFrameContext()
    const [pixelRatio, setPixelRatio] = useState(() => getWindowPixelRatio())
    const { playerDataAddress, playerDataAccount, runDataAddress, runDataAccount, initPlayerCallback, startNewRunCallback, finishRunCallback } = useGameContext()

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
        const playerData: PlayerDataForUnity = {
            publicKey: publicKey ? publicKey.toString() : "",
            name: playerDataAccount ? playerDataAccount.name : "",
            runsFinished: playerDataAccount ? playerDataAccount.runsFinished : 0,
            bestScore: playerDataAccount? playerDataAccount.bestScore.toNumber() : 0,
            isInRun: playerDataAccount? playerDataAccount.isInRun : false
        }
        console.log("sending PlayerData to Unity")
        console.log(JSON.stringify(playerData))
        sendMessage("ReactToUnity", "OnPlayerUpdated", JSON.stringify(playerData));
    }, [publicKey, playerDataAddress, playerDataAccount])

    useEffect(() => {
        // const playerData: PlayerData = {
        //     publicKey: publicKey ? publicKey.toString() : "",
        //     name: playerDataAccount ? playerDataAccount.name : "",
        //     runsFinished: playerDataAccount ? playerDataAccount.runsFinished : 0,
        //     bestScore: playerDataAccount? playerDataAccount.bestScore : new anchor.BN(0),
        //     isInRun: playerDataAccount? playerDataAccount.isInRun : false
        // }
        const runDataForUnity: RunDataForUnity = {
            score: runDataAccount? runDataAccount.score.toNumber() : 0,
            slots: runDataAccount? runDataAccount.slots : null
        }
        console.log("sending RunData to Unity")
        console.log(JSON.stringify(runDataForUnity))
        sendMessage("ReactToUnity", "OnRunUpdated", JSON.stringify(runDataForUnity));
    }, [publicKey, runDataAddress, runDataAccount])









    //UNITY TO REACT

    function handleGameReady() {
        console.log(`React got GameReady from Unity`);
        const playerData: PlayerDataForUnity = {
            publicKey: publicKey ? publicKey.toString() : "",
            name: playerDataAccount ? playerDataAccount.name : "",
            runsFinished: playerDataAccount ? playerDataAccount.runsFinished : 0,
            bestScore: playerDataAccount? playerDataAccount.bestScore.toNumber() : 0,
            isInRun: playerDataAccount? playerDataAccount.isInRun : false
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
    }, [addEventListener, removeEventListener, handleStartNewRunFromUnity]);

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

    function handleStartNewRunFromUnity() {
        console.log(`React got StartNewRunFromUnity`);
        startNewRunCallback();
        return null;
    };

    useEffect(() => {
        addEventListener("StartNewRunFromUnity", handleStartNewRunFromUnity);
        return () => {
            removeEventListener("StartNewRunFromUnity", handleStartNewRunFromUnity);
        };
    }, [addEventListener, removeEventListener, handleStartNewRunFromUnity]);

    function handleFinishRunFromUnity() {
        console.log(`React got FinishRunFromUnity`);
        finishRunCallback();
        return null;
    };

    useEffect(() => {
        addEventListener("FinishRunFromUnity", handleFinishRunFromUnity);
        return () => {
            removeEventListener("FinishRunFromUnity", handleFinishRunFromUnity);
        };
    }, [addEventListener, removeEventListener, handleFinishRunFromUnity]);

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