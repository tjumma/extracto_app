import * as anchor from "@coral-xyz/anchor"

export const initializeCounter = async (publicKey, program, counterAddress, counterDataAccount, showNotification, setLoading, sendTransaction, connection, ) => {
    console.log("Initialize counter");

    if (!publicKey || !program || !counterAddress)
        return;

    if (counterDataAccount) {
        console.log("Counter account is already initialized");

        showNotification({
            status: "info",
            title: "Already initialized!",
            description: `Counter account is already initialized`,
            link: `https://solana.fm/address/${counterAddress}?cluster=http://localhost:8899`,
            linkText: "Counter account"
        })
    }
    else {
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
                title: "Counter initialized!",
                description: `Counter account initialized`,
                link: `https://solana.fm/tx/${txSig}?cluster=http://localhost:8899`,
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
}