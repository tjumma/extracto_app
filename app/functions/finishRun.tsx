import * as anchor from "@coral-xyz/anchor"

export const finishRun = async (publicKey, program, runDataAddress, runDataAccount, playerDataAddress, playerDataAccount, showNotification, setLoading, sendTransaction, connection,) => {
    console.log("Finish run");

    const cantFinishRun = (!publicKey || !program || !runDataAddress || !runDataAccount || !playerDataAddress || !playerDataAccount || !playerDataAccount.isInRun)

    if (cantFinishRun)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .finishRun()
            .accounts({
                run: runDataAddress,
                playerData: playerDataAddress,
                player: publicKey,
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
            title: "Run finished!",
            description: `Run is over`,
            // link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            // linkText: "Transaction"
        })
    }
    catch (e) {
        setLoading(false)

        showNotification({
            status: "error",
            title: "Finish run error!",
            description: `${e}`,
        })
    }
}