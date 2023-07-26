export const incrementViaSession = async (publicKey, program, counterAddress, sessionWallet, showNotification, setLoading?) => {

    const cantIncrementViaSession = (!publicKey || !program || !sessionWallet || !showNotification || sessionWallet.publicKey == null)

    if (cantIncrementViaSession)
        return;

    try {
        if (setLoading) setLoading(true)

        const tx = await program.methods
            .increment()
            .accounts({
                counter: counterAddress,
                user: sessionWallet.publicKey!,
                sessionToken: sessionWallet.sessionToken
            })
            .transaction()

        const txIds = await sessionWallet.signAndSendTransaction(tx)

        if (txIds && txIds.length > 0) {
            showNotification({
                status: "success",
                title: "Increment via session",
                description: `Successfully incremented via session`,
            })
        } else {
            showNotification({
                status: "error",
                title: "Increment via session error!",
            })
        }
    } catch (e) {
        showNotification({
            status: "error",
            title: "Increment via session error!",
            description: `${e}`,
        })
    }
    finally {
        if (setLoading) setLoading(false)
    }
}