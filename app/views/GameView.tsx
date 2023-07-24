'use client'

import { useEffect } from "react";
import { useUnityFrameContext } from "../contexts/UnityFrameContext";

export const GameView: React.FC = () => {

    const { setShowUnityFrame } = useUnityFrameContext()

    useEffect(() => {
        setShowUnityFrame(true)

        return () => {
            setShowUnityFrame(false)
        }
    }, []);

    return (
        <>
        </>
    )
}