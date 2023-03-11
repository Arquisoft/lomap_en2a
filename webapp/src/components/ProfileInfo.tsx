import { Image, Button, Text, Flex, VStack, Box } from "@chakra-ui/react"
import React from "react"

export function ProfileView() {  
    return (
      <Flex
        direction={'column'}
        bg={'whiteAlpha.900'}
        width={"30vw"}
        height={"100vh"}
        position={'absolute'} 
        left={10}
        top={0}
        zIndex={1}
        overflow='hidden'
        px={2}>
        <Text fontSize='1.2em' borderBottomWidth='1px'>Profile Information</Text>
        <VStack>
            <Image
            borderRadius='full' //redondeados
            boxSize='150px'
            src='https://bit.ly/dan-abramov' // imagen por defecto
            alt='Dan Abramov'
            />
            <p style={{"fontSize":"1.2em"}}>Dan Abramov</p>
          </VStack>
          <Box p={2} shadow='md' borderWidth='1px'>
            <Text as="b">User information</Text>
            <Text>198 Locations</Text>
            <Text>199987624 Reviews</Text>
          </Box>
      </Flex>
    )
  }