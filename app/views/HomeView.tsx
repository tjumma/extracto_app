'use client'

import { Flex, Button, Text, useColorMode } from "@chakra-ui/react"

export const HomeView: React.FC = () => {

    const { toggleColorMode } = useColorMode()

    return (
        <Flex direction = "column" px ={10} py={10} alignItems={"center"}>
            <Text mb = {10}>HomeView</Text>
            <Button mb = {6} width = "400px">Button</Button>
            <Button onClick = {toggleColorMode} width = "400px">Toggle Color Mode</Button>
        </Flex>
    )
}