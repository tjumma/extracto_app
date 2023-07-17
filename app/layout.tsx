'use client'

import './wallet.css'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'
import { UnityFrame } from './views/UnityFrame'
import { GameContextProvider } from './contexts/GameContext'
import { Wallet } from './components/Wallet'
import { AnchorContextProvider } from './contexts/AnchorContext'
import { NotificationContextProvider } from './contexts/NotificationContext'

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
                    <Flex direction={"column"} height="100vh">
                      <NavBar />
                      {children}
                      <UnityFrame />
                    </Flex>
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