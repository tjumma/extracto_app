'use client'

import * as anchor from "@coral-xyz/anchor"
import { FC, ReactNode, createContext, useContext, useMemo } from "react"
import idl from "../../extracto_program.json"
import { ExtractoProgram, IDL } from "../../extracto_program"
import { useConnection, useAnchorWallet, AnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { ClockworkProvider } from "@clockwork-xyz/sdk";

const COUNTER_SEED = "counter_1";

export interface AnchorContextState {
    program: anchor.Program<ExtractoProgram>;
    counterAddress: anchor.web3.PublicKey | undefined;
    clockworkProvider: ClockworkProvider;
}

export const AnchorContext = createContext<AnchorContextState>({} as AnchorContextState);

export function useAnchorContext(): AnchorContextState {
    return useContext(AnchorContext);
}

export const AnchorContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const { connection } = useConnection()
    const anchorWallet = useAnchorWallet()

    const provider = useMemo(() => {
        return new anchor.AnchorProvider(connection, anchorWallet as AnchorWallet, {})
    }, [connection, anchorWallet])

    anchor.setProvider(provider)

    const programId = new anchor.web3.PublicKey(idl.metadata.address)
    const program = new anchor.Program<ExtractoProgram>(IDL, programId, provider);

    const clockworkProvider = ClockworkProvider.fromAnchorProvider(provider);

    const [counterAddress] = useMemo(() => {
        return PublicKey.findProgramAddressSync(
            [anchor.utils.bytes.utf8.encode(COUNTER_SEED)],
            program.programId
        );
    }, [program])

    console.log(`Counter address: ${counterAddress}`)

    return (
        <AnchorContext.Provider value={{ program: program, counterAddress: counterAddress, clockworkProvider: clockworkProvider }}>
            {children}
        </AnchorContext.Provider>
    )
};