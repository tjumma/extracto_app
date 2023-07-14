'use client'

import { Link } from '@chakra-ui/next-js'
import { Flex, IconButton, Spacer, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'

export const NavBar: React.FC = () => {

    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex direction="row" px={10} py={5} gap={50} alignItems={"center"} justifyContent={"center"}>
            <Link href='/' color='blue.400' _hover={{ color: 'blue.500' }}>
                HOME
            </Link>
            <Link href='/game' color='blue.400' _hover={{ color: 'blue.500' }}>
                GAME
            </Link>
            <Link href='/clockwork' color='blue.400' _hover={{ color: 'blue.500' }}>
                CLOCKWORK
            </Link>
            <Spacer>

            </Spacer>
            <IconButton
                aria-label='Search database'
                icon={colorMode === 'light'? <SunIcon /> : <MoonIcon />}
                onClick = {toggleColorMode}
            />
            <Link href='/clockwork' color='blue.400' _hover={{ color: 'blue.500' }}>
                WALLET
            </Link>
        </Flex>
    )
}