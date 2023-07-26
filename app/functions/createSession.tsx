export const createSession = async (publicKey, program, sessionWallet, showNotification, setLoading?) => {

    const cantCreateSession = (!publicKey || !program || !sessionWallet || !showNotification)

    if (cantCreateSession)
        return;

    try {
        if (setLoading) setLoading(true)

        const session = await sessionWallet.createSession(
            program.programId,
            true,
            60,
            onSessionCreated
        )

    } catch (e) {

        showNotification({
            status: "error",
            title: "Create session error!",
            description: `${e}`,
        })
    }
    finally {
        if (setLoading) setLoading(false)
    }

    function onSessionCreated(sessionInfo: { sessionToken: string; publicKey: string }): void {

        if (setLoading) setLoading(false)

        showNotification({
            status: "success",
            title: "Session created!",
            description: `Session ${sessionInfo.sessionToken} was created`,
        })
    }
}

