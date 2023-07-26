'use client'

import { Flex, Text } from "@chakra-ui/react"
import { InitializeCounter } from "../components/InitializeCounter"
import { IncrementCounter } from "../components/IncrementCounter"
import { ResetCounter } from "../components/ResetCounter"
import { StartThread } from "../components/StartThread"
import { PauseThread } from "../components/PauseThread"
import { ResumeThread } from "../components/ResumeThread"
import { DeleteThread } from "../components/DeleteThread"
import { useGameContext } from "../contexts/GameContext"
import { CreateSession } from "../components/CreateSession";
import { RevokeSession } from "../components/RevokeSession";
import { IncrementViaSession } from "../components/IncrementViaSession";

export const ClockworkView: React.FC = () => {

    const { counterAddress, counterDataAccount, threadId, threadAuthority, thread, threadDataAccount } = useGameContext()

    return (
        <Flex direction={"row"} px={0} pb={20} pt={10}>
            <Flex direction="column" alignItems={"center"} textAlign={"center"} width="50%">
                <Text mb={5}>{`Counter address: ${counterAddress}`}</Text>
                <Text mb={5}>{`Counter: ${counterDataAccount ? counterDataAccount.count : "null"}`}</Text>
                <Text mb={5}>{`Current thread id: ${counterDataAccount ? threadId : null}`}</Text>
                <Text mb={5}>{`Current thread authority address: ${counterDataAccount ? threadAuthority : null}`}</Text>
                <Text mb={5}>{`Current thread address: ${thread}`}</Text>
                <Text mb={5}>{`thread id: ${threadDataAccount ? threadDataAccount.id : "null"}`}</Text>
                <Text mb={5}>{`thread paused: ${threadDataAccount ? threadDataAccount.paused : "null"}`}</Text>
                <Text mb={5}>{`thread fee: ${threadDataAccount ? threadDataAccount.fee : "null"}`}</Text>
                <Text mb={5}>{`thread name: ${threadDataAccount ? threadDataAccount.name : "null"}`}</Text>
                <Text mb={5}>{`thread created at: ${threadDataAccount ? (new Date(threadDataAccount.createdAt.unixTimestamp.toNumber() * 1000)).toDateString() : "null"}`}</Text>
                <Text mb={5}>{`thread exec since reimb: ${threadDataAccount && threadDataAccount.execContext ? threadDataAccount.execContext.execsSinceReimbursement : "null"}`}</Text>
                <Text mb={5}>{`thread last exec at: ${threadDataAccount && threadDataAccount.execContext ? threadDataAccount.execContext.lastExecAt : "null"}`}</Text>
            </Flex>
            <Flex direction="column" alignItems={"center"} width="50%">
                <InitializeCounter />
                <CreateSession />
                <RevokeSession />
                <IncrementViaSession />
                <IncrementCounter />
                <ResetCounter />
                <StartThread />
                <PauseThread />
                <ResumeThread />
                <DeleteThread />
            </Flex>
        </Flex>
    )
}