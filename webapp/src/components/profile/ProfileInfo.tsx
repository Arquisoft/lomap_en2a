import { Avatar, Text, Flex, VStack, Box, HStack,Icon, Button } from "@chakra-ui/react"
import React, { useState } from "react"
import { getNameFromPod} from "../../solid/solidManagement"
import { useSession } from '@inrupt/solid-ui-react';
import { Location } from "../../types/types";
import { FaStar} from "react-icons/fa";
import {MdLocationOn} from "react-icons/md"
import {RiLogoutBoxLine} from 'react-icons/ri'

type ProfileProps = {
  locations : Array<Location>
}

export function ProfileView(props:ProfileProps) {  
  const session = useSession();
  const [name, setName] = React.useState("");
  const [avgRatings, setavgRatings] = useState(0)

  React.useEffect(() => {
    handleName()
  }, []);

  React.useEffect(()=>{
    setavgRatings( getAverageOfAllLocations(props.locations))
  },[props.locations])

  const handleName = async () => {
    // if we have a valid webid, retrieve the name. Else retrieve generic unidentified name
    if (session.session.info.webId !== undefined && session.session.info.webId !== ""){
      const n  = await getNameFromPod(session.session.info.webId as string)
      setName(n)
    }
    else{
      setName("Loading name...")
    }
  }
  
  const getAverageOfAllLocations = (locations): number => {
    const totalSum = locations.reduce((acc, location) => {
      const ratings = location.ratings;
      if (!ratings) return acc;
      const sum = Array.from(ratings.values()).reduce((acc, val) => ((acc as number) + (val as number)) as number, 0);
      return acc + sum;
    }, 0);
    const totalSize = locations.reduce((acc, location) => {
      const ratings = location.ratings;
      if (!ratings) return acc;
      return acc + ratings.size;
    }, 0);
    return totalSum / totalSize;
  };

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
        borderRight={"1px solid black"}
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
          <Text as="b" fontSize={'2x1'}>Statistics</Text>
            <HStack>
              <Icon as={MdLocationOn} color="red.500" />
              <Text>Number of locations:</Text>
              <Text data-testid="nLocations" as={'b'}>{props.locations.length}</Text>
            </HStack>
            <HStack>
              <Icon as={FaStar} color="yellow.500" />
              <Text>Average rating for locations: </Text>
              <Text data-testid="avgRatings" as={'b'}>{Number.isNaN(avgRatings)?'No ratings':avgRatings.toFixed(2)}</Text>
            </HStack>
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