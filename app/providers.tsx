'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import { Ysabeau } from 'next/font/google';

const ysabeau = Ysabeau({ weight: '600', subsets: ['latin'] });

export const theme = extendTheme({
  fonts: {
    heading: 'var(--font-ysabeau)',
    body: 'var(--font-ysabeau)',
  }
});

export function Providers({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style jsx global>
        {`
        :root {
          --font-ysabeau: ${ysabeau.style.fontFamily};
        }
      `}
      </style>
      <CacheProvider>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </CacheProvider>
    </>
  )
}