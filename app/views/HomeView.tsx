'use client'

import { Flex, Button, Text } from "@chakra-ui/react"

export const HomeView: React.FC = () => {

    return (
        <Flex direction = "column" px ={0} py={0} alignItems={"center"}>
            <Text mt={10} mb={10}>HomeView</Text>
            <Button mb={6} width = "400px">Button</Button>
        </Flex>
    )
}