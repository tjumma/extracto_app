export const resumeThread = async (publicKey, program, clockworkProvider, thread, threadDataAccount, threadAuthority, threadId, showNotification) => {
    
    const cantResumeThread = (threadDataAccount === null || !threadDataAccount.paused || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    if (cantResumeThread)
        return

    try {
        await program.methods
            .resumeThread()
            .accounts({
                user: publicKey,
                clockworkProgram: clockworkProvider.threadProgram.programId,
                thread: thread,
                threadAuthority: threadAuthority,
            })
            .rpc();

        showNotification({
            status: "success",
            title: "Thread resumed!",
            description: `Thread "${threadId}" has been resumed`,
        })
    }
    catch (e) {
        showNotification({
            status: "error",
            title: "Thread resume error!",
            description: `${e}`,
        })
    }
}