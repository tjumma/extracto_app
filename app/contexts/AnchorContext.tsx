'use client'

import * as anchor from "@coral-xyz/anchor"
import { FC, ReactNode, createContext, useContext, useMemo } from "react"
import idl from "../../extracto_program.json"
import { ExtractoProgram, IDL } from "../../extracto_program"
import { useConnection, useAnchorWallet, AnchorWallet, useWallet } from "@solana/wallet-adapter-react"
import { ClockworkProvider } from "@clockwork-xyz/sdk";

export interface AnchorContextState {
    program: anchor.Program<ExtractoProgram>;
    clockworkProvider: ClockworkProvider;
}

export const AnchorContext = createContext<AnchorContextState>({} as AnchorContextState);

export function useAnchorContext(): AnchorContextState {
    return useContext(AnchorContext);
}

export const AnchorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()

    const { publicKey} = useWallet()

    const provider = useMemo(() => {
        return new anchor.AnchorProvider(connection, anchorWallet as AnchorWallet, {})
    }, [connection, anchorWallet])

    anchor.setProvider(provider)

    const programId = new anchor.web3.PublicKey(idl.metadata.address)
    const program = new anchor.Program<ExtractoProgram>(IDL, programId, provider);

    const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

    return (
        <AnchorContext.Provider value={{ program: program, clockworkProvider: clockworkProvider }}>
            {children}
        </AnchorContext.Provider>
    )
};