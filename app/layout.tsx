'use client'

import './wallet.css'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'
import { UnityFrame } from './views/UnityFrame'
import { GameContextProvider } from './contexts/GameContext'
import { Wallet } from './components/Wallet'

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
              <GameContextProvider>
                <Flex direction={"column"} height="100vh">
                  <NavBar />
                  {children}
                  <UnityFrame />
                </Flex>
              </GameContextProvider>
            </Wallet>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}