'use client'

import { Link } from '@chakra-ui/next-js'
import { Flex, Spacer } from '@chakra-ui/react'

export const NavBar: React.FC = () => {

    return (
        <Flex direction="row" px = {10} py = {5} gap = {50}>
            <Link href='/' color='blue.400' _hover={{ color: 'blue.500' }}>
                Home
            </Link>
            <Link href='/game' color='blue.400' _hover={{ color: 'blue.500' }}>
                Game
            </Link>
            <Link href='/clockwork' color='blue.400' _hover={{ color: 'blue.500' }}>
                Clockwork
            </Link>
            <Spacer>
                
            </Spacer>
            <Link href='/clockwork' color='blue.400' _hover={{ color: 'blue.500' }}>
                Wallet
            </Link>
        </Flex>
    )
}