export const deleteThread = async (publicKey, program, clockworkProvider, thread, threadId, threadAuthority, threadDataAccount, showNotification) => {

    const cantDeleteThread = (threadDataAccount === null || !threadId || !publicKey || !clockworkProvider || !threadAuthority || !thread)

    if (cantDeleteThread)
        return

    try {
        await program.methods
            .deleteThread()
            .accounts({
                user: publicKey,
                clockworkProgram: clockworkProvider.threadProgram.programId,
                thread: thread,
                threadAuthority: threadAuthority
            })
            .rpc();

        showNotification({
            status: "success",
            title: "Thread deleted!",
            description: `Thread "${threadId}" has been deleted`,
        })
    }
    catch (e) {
        showNotification({
            status: "error",
            title: "Thread delete error!",
            description: `${e}`,
        })
    }
}