export const pauseThread = async(publicKey, program, thread, threadId, threadDataAccount, clockworkProvider, threadAuthority, showNotification) => {

    const cantPauseThread = (threadDataAccount === null || threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    if (cantPauseThread)
            return

        try {
            await program.methods
                .pauseThread()
                .accounts({
                    user: publicKey,
                    clockworkProgram: clockworkProvider.threadProgram.programId,
                    thread: thread,
                    threadAuthority: threadAuthority,
                })
                .rpc();

            showNotification({
                status: "success",
                title: "Thread paused!",
                description: `Thread "${threadId}" has been paused`,
            })
        }
        catch (e) {
            showNotification({
                status: "error",
                title: "Thread pause error!",
                description: `${e}`,
            })
        }
}