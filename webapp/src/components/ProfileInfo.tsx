import { Avatar, Button, Text, Flex, VStack, Box } from "@chakra-ui/react"
import React from "react"
import { getNameFromPod } from "../solid/solidManagement"
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { Session } from "@inrupt/solid-client-authn-browser";


export function ProfileView(props:any) {  

  const [name, setName] = React.useState("");

  React.useEffect(() => {
    handleName()
  }, []);

  const handleName = async () => {
    // if we have a valid webid, retrieve the name. Else retrieve generic unidentified name
    if (props.webId !== undefined && props.webId !== ""){
      const n  = await getNameFromPod(props.webId)
      setName(n)
    }
    else{
      setName("John Doe")
    }
  }

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
          <Text fontSize='1.2em' as="b">{name}</Text>
        </VStack>
          <Box p={2} shadow='md' borderWidth='1px'>
            <Text as="b">Statistics</Text>
            <Text>198 Locations</Text>
            <Text>199987624 Reviews</Text>
          </Box>
      </Flex>
    )
  }