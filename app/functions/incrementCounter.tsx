export const incrementCounter = async (publicKey, program, counterAddress, setLoading, sendTransaction, connection, showNotification) => {
    console.log("Increment counter");

    if (!publicKey || !program || !counterAddress)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .increment()
            .accounts({
                counter: counterAddress,
                user: publicKey,
            })
            .transaction()

        const txSig = await sendTransaction(tx, connection, {
            skipPreflight: true,
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
            title: "Counter incremented!",
            description: `Counter account incremented`,
            link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
            linkText: "Transaction"
        })
    }
    catch (e) {
        setLoading(false)

        showNotification({
            status: "error",
            title: "Increment error!",
            description: `${e}`,
        })
    }
}