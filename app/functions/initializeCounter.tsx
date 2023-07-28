import * as anchor from "@coral-xyz/anchor"

export const initializeCounter = async (publicKey, program, counterAddress, counterDataAccount, showNotification, setLoading, sendTransaction, connection,) => {
    console.log("Initialize counter");

    const cantInitializeCounter = (!publicKey || !program || !counterAddress || counterDataAccount !== null)

    if (cantInitializeCounter)
        return;

    try {
        setLoading(true)

        const tx = await program.methods
            .initialize()
            .accounts({
                counter: counterAddress,
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
            title: "Counter initialized!",
            description: `Counter account initialized`,
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