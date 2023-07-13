'use client'

import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useState } from "react"

export interface GameContextState {
    showGame: boolean;
    setShowGame: Dispatch<SetStateAction<boolean>>
}

export const GameContext = createContext<GameContextState>({} as GameContextState);

export function useGameContext(): GameContextState {
    return useContext(GameContext);
}

export const GameContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const [showGame, setShowGame] = useState(false)

    return (
        <GameContext.Provider value = {{ showGame: showGame, setShowGame: setShowGame}}>
            {children}
        </GameContext.Provider>
    )
}