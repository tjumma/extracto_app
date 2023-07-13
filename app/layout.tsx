'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'
import { UnityFrame } from './views/UnityFrame'
import { GameContextProvider } from './contexts/GameContext'

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

export const theme = extendTheme({ config })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <ColorModeScript />
        <CacheProvider>
          <ChakraProvider theme={theme}>
            <GameContextProvider>
              <Flex direction={"column"} height="100vh">
                <NavBar />
                {children}
                <UnityFrame />
              </Flex>
            </GameContextProvider>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}