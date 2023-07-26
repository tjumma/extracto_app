export const revokeSession = async (publicKey, sessionWallet, showNotification, setLoading?) => {

    const cantRevokeSession = (!publicKey || !sessionWallet || !showNotification || sessionWallet.publicKey === null)

    if (cantRevokeSession)
        return;

    try {
        if (setLoading) setLoading(true)

        const txHash = await sessionWallet.revokeSession();

        if (!txHash) {
            showNotification({
                status: "error",
                title: "Revoke session cancelled!",
            })
        }
        else {
            showNotification({
                status: "success",
                title: "Session revoked!",
                description: `Session has been revoked`,
            })
        }

    } catch (e) {

        showNotification({
            status: "error",
            title: "Revoke session error!",
            description: `${e}`,
        })
    }
    finally {
        if (setLoading) setLoading(false)
    }
}

