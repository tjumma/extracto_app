'use client'

import { Flex, Button, Text } from "@chakra-ui/react"
import { RequestAirdrop } from "../components/RequestAirdrop"

export const HomeView: React.FC = () => {

    return (
        <Flex direction = "column" px ={0} py={0} alignItems={"center"}>
            <Text mt={10} mb={10}>Greetings!</Text>
            <RequestAirdrop />
        </Flex>
    )
}