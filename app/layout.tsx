'use client'

import './wallet.css'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'
import { UnityFrame } from './views/UnityFrame'
import { GameContextProvider } from './contexts/GameContext'
import { Wallet } from './components/Wallet'
import { AnchorContext, AnchorContextProvider } from './contexts/AnchorContext'

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
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}