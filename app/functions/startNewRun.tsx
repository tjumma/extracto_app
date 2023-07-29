import { SystemProgram } from "@solana/web3.js";

export const startNewRun = async (publicKey, program, playerDataAccount, runDataAddress, runDataAccount, playerDataAddress, showNotification, sendTransaction, connection, clockworkProvider, thread, threadAuthority, threadId, setLoading?) => {
    console.log("Start new run");

    const cantStartNewRun = (!publicKey || !program || !runDataAddress || !playerDataAccount || playerDataAccount.isInRun || !thread || !threadAuthority || !threadId)

    if (cantStartNewRun)
    {
        console.log("CANT START NEW RUN")
        return;
    }

    try {
        if (setLoading) setLoading(true)

        const tx = await program.methods
            .startNewRun(Buffer.from(threadId))
            .accounts({
                run: runDataAddress,
                playerData: playerDataAddress,
                player: publicKey,
                systemProgram: SystemProgram.programId,
                clockworkProgram: clockworkProvider.threadProgram.programId,
                thread: thread,
                threadAuthority: threadAuthority,
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
            title: "Run initialized!",
            description: `Run account initialized`,
            // link: `https://solana.fm/tx/${txSig}?cluster=devnet`,
            // linkText: "Transaction"
        })
    }
    catch (e) {
        if (setLoading) setLoading(false)

        showNotification({
            status: "error",
            title: "Initialize error!",
            description: `${e}`,
        })
    }
}