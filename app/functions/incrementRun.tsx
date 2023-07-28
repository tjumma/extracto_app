export const incrementRun = async (publicKey, program, runDataAddress, sendTransaction, connection, showNotification, setLoading?) => {
    console.log("Increment run");

    if (!publicKey || !program || !runDataAddress)
        return;

    try {
        if (setLoading) setLoading(true)

        const tx = await program.methods
            .increment()
            .accounts({
                run: runDataAddress,
                user: publicKey,
                sessionToken: null
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

        if (setLoading) setLoading(false)

        showNotification({
            status: "success",
            title: "Run incremented!",
            description: `Run account incremented`,
            link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            linkText: "Transaction"
        })
    }
    catch (e) {
        if (setLoading) setLoading(false)

        showNotification({
            status: "error",
            title: "Increment error!",
            description: `${e}`,
        })
    }
}