'use client'

import { FC, ReactNode, createContext, useContext, useState } from "react"

export interface UnityFrameContextState {
    showUnityFrame: boolean;
    setShowUnityFrame: (show: boolean) => void
}

export const UnityFrameContext = createContext<UnityFrameContextState>({} as UnityFrameContextState);

export function useUnityFrameContext(): UnityFrameContextState {
    return useContext(UnityFrameContext);
}

export const UnityFrameContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [showUnityFrame, setShowUnityFrame] = useState(false)

    return (
        <UnityFrameContext.Provider value = {{ showUnityFrame: showUnityFrame, setShowUnityFrame: setShowUnityFrame}}>
            {children}
        </UnityFrameContext.Provider>
    )
}