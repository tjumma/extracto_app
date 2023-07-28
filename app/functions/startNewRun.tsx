import * as anchor from "@coral-xyz/anchor"

export const startNewRun = async (publicKey, program, playerDataAccount, runDataAddress, runDataAccount, playerDataAddress, showNotification, setLoading, sendTransaction, connection,) => {
    console.log("Start new run");

    const cantInitializeRun = ( !publicKey || !program || !runDataAddress || !playerDataAccount || playerDataAccount.isInRun)

    if (cantInitializeRun)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .startNewRun()
            .accounts({
                run: runDataAddress,
                playerData: playerDataAddress,
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
            // link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            // linkText: "Transaction"
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