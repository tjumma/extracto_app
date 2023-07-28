import * as anchor from "@coral-xyz/anchor"

export const initializePlayer = async (name, publicKey, program, connection, playerDataAddress, playerDataAccount, showNotification, sendTransaction, setLoading?) => {
    console.log("Initialize PlayerData");

    const cantInitializePlayer = ( !publicKey || !program || !playerDataAddress || playerDataAccount !== null)

    if (cantInitializePlayer)
        return;

    try {
        if (setLoading) setLoading(true)

        const tx = await program.methods
            .initPlayer(name)
            .accounts({
                playerData: playerDataAddress,
                player: publicKey,
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

        if (setLoading) setLoading(false)

        showNotification({
            status: "success",
            title: "Player initialized!",
            description: `PlayerData account has been initialized`,
            // link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            // linkText: "Transaction"
        })
    }
    catch (e) {
        if (setLoading) setLoading(false)

        showNotification({
            status: "error",
            title: "Player initialize error!",
            description: `${e}`,
        })
    }
}