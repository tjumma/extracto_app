'use client'

import './wallet.css'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'
import { UnityFrame } from './views/UnityFrame'
import { UnityFrameContextProvider } from './contexts/UnityFrameContext'
import { Wallet } from './components/Wallet'
import { AnchorContextProvider } from './contexts/AnchorContext'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { GameContextProvider } from './contexts/GameContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
  }

  const theme = extendTheme({ config })

  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <NotificationContextProvider>
              <Wallet>
                <AnchorContextProvider>
                  <GameContextProvider>
                    <UnityFrameContextProvider>
                      <Flex direction={"column"} height="100vh">
                        <NavBar />
                        {children}
                        <UnityFrame />
                      </Flex>
                    </UnityFrameContextProvider>
                  </GameContextProvider>
                </AnchorContextProvider>
              </Wallet>
            </NotificationContextProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}