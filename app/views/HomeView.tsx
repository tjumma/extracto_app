'use client'

import { Flex, Button, Text, Link } from "@chakra-ui/react"
import { RequestAirdrop } from "../components/RequestAirdrop"

export const HomeView: React.FC = () => {

    return (
        <Flex direction="column" px={0} py={0} alignItems={"center"}>
            <Text mt={10} mb={10}>
                Greetings!
            </Text>
            <Text mt={0} mb={10}>
                Extracto is a fully on-chain game made specifically for the Speedrun Hackathon by Lamport DAO.
            </Text>
            <Link mb = {10} href='/game' color='blue.400' _hover={{ color: 'blue.500' }}>
                    Try it now
                </Link>
            <RequestAirdrop/>
            <Text mt={0} mb={10}>
                If the airdrop doesn't work, try this <Link href="https://solfaucet.com" color='blue.400'>Faucet</Link>
            </Text>
        </Flex>
    )
}