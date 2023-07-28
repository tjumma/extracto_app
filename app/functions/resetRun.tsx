export const resetRun = async (publicKey, program, runDataAddress, setLoading, sendTransaction, connection, showNotification) => {
    console.log("Reset run");

    if (!publicKey || !program || !runDataAddress)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .reset()
            .accounts({
                run: runDataAddress,
                user: publicKey,
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
            title: "Run reset!",
            description: `Run has been reset`,
            link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            linkText: "Transaction"
        })
    }
    catch (e) {
        setLoading(false)

        showNotification({
            status: "error",
            title: "Reset error!",
            description: `${e}`,
        })
    }
}