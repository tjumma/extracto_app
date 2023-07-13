'use client'

import { Flex, Button, Text, useColorMode } from "@chakra-ui/react"

export const HomeView: React.FC = () => {

    const { toggleColorMode } = useColorMode()

    return (
        <Flex direction = "column" ml ={10}>
            <Text mt = {6} mb ={6}>HomeView</Text>
            <Button mb = {6} colorScheme = "orange" width = "400px">Button</Button>
            <Button onClick = {toggleColorMode} width = "400px">Toggle Color Mode</Button>
        </Flex>
    )
}