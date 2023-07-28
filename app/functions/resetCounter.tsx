export const resetCounter = async (publicKey, program, counterAddress, setLoading, sendTransaction, connection, showNotification) => {
    console.log("Reset counter");

    if (!publicKey || !program || !counterAddress)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .reset()
            .accounts({
                counter: counterAddress,
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
            title: "Counter reset!",
            description: `Counter has been reset`,
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