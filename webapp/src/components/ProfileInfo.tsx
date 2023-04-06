import { Avatar, Text, Flex, VStack, Box, Button,Icon } from "@chakra-ui/react"
import React, { useContext } from "react"
import { getNameFromPod} from "../solid/solidManagement"
import { useSession } from '@inrupt/solid-ui-react';
import {RiLogoutBoxLine} from 'react-icons/ri'

export function ProfileView() {  
  const session = useSession();
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    handleName()
  }, []);

  const handleName = async () => {
    // if we have a valid webid, retrieve the name. Else retrieve generic unidentified name
    if (session.session.info.webId !== undefined && session.session.info.webId !== ""){
      const n  = await getNameFromPod(session.session.info.webId as string)
      setName(n)
    }
    else{
      setName("John Doe")
    }
  }

    return (
      <Flex
        direction={'column'}
        bg={'white'}
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
          <Text fontSize='1.2em' as="b">{name}</Text>
        </VStack>
          <Box p={2} shadow='md' borderWidth='1px'>
            <Text as="b">Statistics</Text>
            <Text>N Locations</Text>
            <Text>N Reviews</Text>
          </Box>
          <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>

        <Button colorScheme='red' leftIcon={<Icon as={RiLogoutBoxLine} width='max-content' height={'2 em'} minHeight={'10px'} minWidth={'10px'} />}
          size='lg'
          onClick={() => {
            session.logout();
          }}
        >
          Logout
        </Button>
      </Box>
      </Flex>
    )
  }