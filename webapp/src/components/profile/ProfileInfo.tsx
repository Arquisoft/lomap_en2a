import { Avatar, Text, Flex, VStack, Box, HStack,Icon, Checkbox, Button, CloseButton } from "@chakra-ui/react"
import React, { useState } from "react"
import { getNameFromPod, getSolidFriends} from "../../solid/solidManagement"
import { useSession } from '@inrupt/solid-ui-react';
import { Location } from "../../types/types";
import { FaStar} from "react-icons/fa";
import {MdLocationOn, MdPeopleAlt} from "react-icons/md"
import {RiLogoutBoxLine} from 'react-icons/ri'
import { LogoutAlertDialog } from '../dialogs/LogoutAlertDialog';

type ProfileProps = {
  setSelectedView: (viewName: string) => void //function to change the selected view on the left
  locations : Array<Location>
}

export function ProfileView(props:ProfileProps) {  
  const session = useSession();
  const [name, setName] = React.useState("");
  const [avgRatings, setavgRatings] = useState(0)
  const [numberFriends, setNumberFriends] = useState("Loading friends...")

  React.useEffect(() => {
    handleName()
  }, []);

  React.useEffect(()=>{
    setavgRatings( getAverageOfAllLocations(props.locations))
  },[props.locations])

  React.useEffect(() => {
    getNumberOfFriends()
  })

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

  const getNumberOfFriends = async () => {
    const n  = (await getSolidFriends(session.session.info.webId as string)).length
    setNumberFriends(n.toString())
  }

  

  return (
    <Flex
      direction={'column'}
      bg={'white'}
      width={"30%"}
      height={"100%"}
      position={'absolute'} 
      left='3%'
      top={0}
      zIndex={1}
      borderRightWidth={'1px'}
      overflow='hidden'
      px={2}>
      <CloseButton onClick={() => props.setSelectedView('Map')} position='absolute' top='2%' right='2%'></CloseButton>
      <Text alignSelf='center' fontSize='2.2em' borderBottomWidth='1px' margin={'2%'}>Profile Information</Text>
      <VStack>
          <Avatar 
          marginTop={'2%'}
          bg='red.500'
          size='xl'/>
        <Text fontSize='1.2em' as="b">{name}</Text>
      </VStack>
      <Box p={'4%'} shadow='md' borderWidth='1px' marginLeft={'5%'} marginRight={'5%'} marginTop={'5%'}>
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
        <HStack>
          <Icon as={MdPeopleAlt} color="green" />
          <Text>Number of friends: </Text>
          <Text data-testid="numFriends" as={'b'}>{numberFriends}</Text>
        </HStack>
      </Box>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'5%'} marginBottom={'3%'}>
        <LogoutAlertDialog></LogoutAlertDialog>
      </Box>
    </Flex>
  )
}