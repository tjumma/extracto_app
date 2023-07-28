import * as anchor from "@coral-xyz/anchor"

export const initializeRun = async (publicKey, program, runDataAddress, runDataAccount, showNotification, setLoading, sendTransaction, connection,) => {
    console.log("Initialize run");

    const cantInitializeRun = (!publicKey || !program || !runDataAddress || runDataAccount !== null)

    if (cantInitializeRun)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .startNewRun()
            .accounts({
                run: runDataAddress,
                user: publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .transaction()

        const txSig = await sendTransaction(tx, connection, {
            // skipPreflight: true,
        })

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txSig,
        })

        setLoading(false)

        showNotification({
            status: "success",
            title: "Run initialized!",
            description: `Run account initialized`,
            link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            linkText: "Transaction"
        })
    }
    catch (e) {
        setLoading(false)

        showNotification({
            status: "error",
            title: "Initialize error!",
            description: `${e}`,
        })
    }
}