import { Avatar, Button, Text, Flex, VStack, Box } from "@chakra-ui/react"
import React from "react"

export function ProfileView() {  
    return (
      <Flex
        direction={'column'}
        bg={'whiteAlpha.900'}
        width={"30vw"}
        height={"100vh"}
        position={'absolute'} 
        left='5vw'
        top={0}
        zIndex={1}
        overflow='hidden'
        px={2}>
        <Text fontSize='1.2em' borderBottomWidth='1px' margin={'20px'}>Profile Information</Text>
        <VStack>
            <Avatar 
            marginTop={'20px'}
            bg='red.500'
            size='xl'/>
          <Text fontSize='1.2em' as="b">Dan Abramov</Text>
        </VStack>
          <Box p={2} shadow='md' borderWidth='1px'>
            <Text as="b">Statistics</Text>
            <Text>198 Locations</Text>
            <Text>199987624 Reviews</Text>
          </Box>
      </Flex>
    )
  }