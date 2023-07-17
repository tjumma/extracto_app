'use client'

import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertStatus, AlertTitle, Box, Link, useToast } from "@chakra-ui/react";
import { FC, ReactNode, createContext, useCallback, useContext } from "react";

export interface NotificationContextState {
    showNotification(notificationOptions: NotificationOptions): void
}

export interface NotificationOptions {
    status?: AlertStatus
    title?: string;
    description?: string;
    link?: string
    linkText?: string
}

export const NotificationContext = createContext<NotificationContextState>({} as NotificationContextState);

export function useNotificationContext(): NotificationContextState {
    return useContext(NotificationContext);
}

export const NotificationContextProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const toast = useToast()

    const addToast = useCallback((notificationOptions: NotificationOptions) => {
        toast({
            position: 'bottom-left',
            duration: 3000,
            isClosable: true,
            render: () => (
                <Alert status={notificationOptions.status} rounded={"lg"} py={"20px"} px={"30px"}>
                    <AlertIcon boxSize='20px' />
                    <Box flexDirection={"column"}>
                        <AlertTitle>{notificationOptions.title}</AlertTitle>
                        <AlertDescription>{notificationOptions.description}</AlertDescription>
                        {notificationOptions.link !== undefined && notificationOptions.linkText !== undefined &&
                            <Box textAlign={"right"}>
                                <Link href={notificationOptions.link} isExternal>
                                    <ExternalLinkIcon/> {notificationOptions.linkText}
                                </Link>
                            </Box>}
                    </Box>
                </Alert>
            )
        })
    }, [toast])

    return (
        <NotificationContext.Provider value={{ showNotification: addToast }}>
            {children}
        </NotificationContext.Provider>
    )
};