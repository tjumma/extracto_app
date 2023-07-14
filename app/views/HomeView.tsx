'use client'

import { Flex, Button, Text, useColorMode } from "@chakra-ui/react"

export const HomeView: React.FC = () => {

    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <Flex direction = "column" px ={0} py={0} alignItems={"center"}>
            <Text mb = {10}>HomeView</Text>
            <Button mb = {6} width = "400px">Button</Button>
        </Flex>
    )
}