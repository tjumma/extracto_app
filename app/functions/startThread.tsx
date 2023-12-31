import { SystemProgram } from "@solana/web3.js";

export const startThread = async(publicKey, clockworkProvider, threadDataAccount, threadId, threadAuthority, thread, runAddress, program, showNotification) => {

    const cantStartNewThread = (threadDataAccount != null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread || !runAddress)

    if (cantStartNewThread)
            return

        try {
            await program.methods
                .startThread(Buffer.from(threadId))
                .accounts({
                    user: publicKey,
                    systemProgram: SystemProgram.programId,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority,
                    run: runAddress,
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread started!",
                description: `Thread has been started`,
                link: `https://app.clockwork.xyz/threads/${thread}?cluster=devnet`,
                linkText: "Thread"
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread start error!",
                description: `${e}`,
            })
        }
}