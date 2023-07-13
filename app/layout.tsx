'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript, Flex, extendTheme } from '@chakra-ui/react'
import { NavBar } from './components/NavBar'

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
            <Flex direction={"column"} height="100vh">
              <NavBar />
              {children}
            </Flex>
          </ChakraProvider>
        </CacheProvider>
      </body>
    </html>
  )
}