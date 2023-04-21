import { Avatar, Text, Flex, VStack, Box, HStack,Icon, Stack, Progress, CloseButton } from "@chakra-ui/react"
import React, { useState } from "react"
import { useSession } from '@inrupt/solid-ui-react';
import { Location } from "../../types/types";
import {MdOutlineLocalPolice, MdOutlineMilitaryTech} from "react-icons/md"
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { GiBowman } from "react-icons/gi";
import { getSolidFriends} from "../../solid/solidManagement"


type GamePanelProps = {
  setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
  locations : Array<Location>
}

export function GamePanel(props:GamePanelProps) {  
  const session = useSession();
  const [avgRatings, setavgRatings] = useState(0)
  const [trophies, setTrophies] = useState(0);
  const ranks = ["Newbie", "Explorer", "Connoisseur", "Master"]
  const [rank, setRank] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [museumsCounter, setMuseumsCounter] = useState(0);
  const [isPlaceWith4Categories, setIsPlaceWith4Categories] = useState(false)
  const [numberFriends, setNumberFriends] = useState(0)
  const [achievedChallenges, setAchievedChallenges] = useState(0)

  React.useEffect(()=>{
    setavgRatings( getAverageOfAllLocations(props.locations))
    calculateTrophies()
    countMuseums();
    checkPlace4Categories();
    checkIf20Locations();
    // checkChallengesTrophies();
  },[props.locations])

  React.useEffect(() => {
    calculateRank();
    calculateProcessPercentage();
  }, [trophies])

  React.useEffect(() => {
    calculateProcessPercentage();
  }, [rank])

  React.useEffect(() => {
    getNumberOfFriends();
  }, [])
  
  const checkChallengesTrophies = () => {
    setTrophies(trophies + achievedChallenges*25)
  }

  const checkPlace4Categories = () => {
    let isPlace = false;
    props.locations.find(location => location.category.length >= 4? isPlace=true : isPlace=isPlace)
    if (isPlace)
      setAchievedChallenges(achievedChallenges+1);
    setIsPlaceWith4Categories(isPlace);
  }

  const countMuseums = () => {
    let museums = 0;
    props.locations.forEach(location => location.category.includes('Museum')? museums++ : museums)
    if (museums >= 10)
      setAchievedChallenges(achievedChallenges+1)
    setMuseumsCounter(museums);
  }

  const checkIf20Locations = () => {
    if (props.locations.length >= 20)
      setAchievedChallenges(achievedChallenges+1);
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
    if (totalSum/totalSize == 5)
      setAchievedChallenges(achievedChallenges+1);
    return totalSum / totalSize;
  };

  const trophiesPerCategory =(location:Location) => {
    return location.category.length*5; // for each category added in the location, +5 trophies
  }

  const trophiesPerReviews = (location:Location) => {
    // for each review add 5 trophies
    return location.reviews?.length !== undefined ? location.reviews.length * 5 : 0;
  }

  const getNumberOfFriends = async () => {
    const n  = (await getSolidFriends(session.session.info.webId as string)).length
    if (n > 15)
      setAchievedChallenges(achievedChallenges+1)
    setNumberFriends(n)
  }

  const calculateTrophies = () => {
    const numberOfLocations = props.locations.length;
    let trophies = numberOfLocations * 50;
    for (let location of props.locations){
      trophies += trophiesPerCategory(location)
      trophies += trophiesPerReviews(location)
    }
    trophies += getAverageOfAllLocations(props.locations)*10;
    setTrophies(trophies)
    calculateRank();
    calculateProcessPercentage();
  }

  const calculateRank = () => {
    if (trophies < 300 && trophies > 0)
      setRank(ranks[0]);
    if (trophies < 600 && trophies > 300)
      setRank(ranks[1]);
    if (trophies < 900 && trophies > 600)
      setRank(ranks[2]);
    if (trophies > 900)
      setRank(ranks[3]);    
  }

  const calculateProcessPercentage = () => {
    const rankThresholds = [0, 300, 600, 900]; // Umbral de trofeos para cada rango
    const rankIndex = ranks.indexOf(rank);
    const currentRankTrophies = trophies - rankThresholds[rankIndex]; // Número de trofeos dentro del rango actual
    const nextRankTrophies = rankThresholds[rankIndex + 1] - rankThresholds[rankIndex]; // Número de trofeos para alcanzar el siguiente rango
    const progressPercentage = (currentRankTrophies / nextRankTrophies) * 100; // Porcentaje de progreso dentro del rango actual
    const roundedPercentage = Math.round(progressPercentage);
    setProgressPercentage(roundedPercentage);
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
      <CloseButton onClick={() => props.setSelectedView(<></>)} position='absolute' top='2%' right='2%'></CloseButton>
      <Text alignSelf='center' fontSize='2.2em' borderBottomWidth='1px' margin={'2%'}>Progess Record</Text>
      <Text alignSelf='center' fontSize='1.2em' margin={'2%'}>Keep adding locations to increase your trophies and rank!</Text>
      <Flex px={'4%'} marginLeft={'5%'} marginRight={'5%'} marginTop={'2%'} direction='row'>
        <Flex alignItems={'center'} width={'fit-content'} gap='6%' borderWidth={'2px'} px='4%' borderRadius={'25'} bgColor={'gray.200'}>
          <Icon as={MdOutlineMilitaryTech} width={'2.5em'} height={'2.5vw'} color="yellow.500" />
          <Text fontSize={'2em'}>{trophies}</Text>
        </Flex>
        <Flex alignItems={'center'} width={'fit-content'} marginLeft='auto' gap='6%' borderWidth={'2px'} px='4%' borderRadius={'25'} bgColor={'gray.200'}>
          <Icon as={MdOutlineLocalPolice} width={'2.5em'} height={'2.5vw'} color="brown" />
          <Text fontSize={'1.8em'}>{rank}</Text>
        </Flex>
      </Flex>
      <HStack justifyContent={'center'} paddingX={'10%'}>
        <VStack>
          <Text fontSize={'1em'}>Current rank:</Text>
          <Text as={'b'} fontSize={'1.5em'}>{rank}</Text>
        </VStack>
        <CircularProgress padding={'50px'} alignSelf={'center'} value={progressPercentage} color='green.400' size={'250px'} thickness={6}>
          <CircularProgressLabel>{progressPercentage}%</CircularProgressLabel>
        </CircularProgress>
        <VStack>
          <Text fontSize={'1em'}>Next rank:</Text>
          <Text as={'b'} fontSize={'1.5em'}>{ranks.length > ranks.indexOf(rank)+1? ranks[ranks.indexOf(rank)+1] : ranks[ranks.length-1]}</Text>
        </VStack>
      </HStack>
      <Text alignSelf={'center'} fontSize={'2.5em'}>
        <Icon as={GiBowman} width={'1.5em'} height={'1.5vw'}/>
        Challenges
        <Icon as={GiBowman} width={'1.5em'} height={'1.5vw'}/>
      </Text>
      <Stack spacing={4} padding={'10%'}>
        <Text>Add 20 locations</Text>
        <Progress colorScheme='red' size='sm' value={Math.round(props.locations.length * 100 / 20)}/>

        <Text>Add a location with 4 categories</Text>
        <Progress colorScheme='yellow' size='sm' value={isPlaceWith4Categories?100:0}/>

        <Text>Have in your list 10 museums</Text>
        <Progress colorScheme='blue' size='sm' value={Math.round(museumsCounter * 100 / 20)}/>

        <Text>Make your average location rating 5</Text>
        <Progress colorScheme='purple' size='sm' value={Math.round(getAverageOfAllLocations(props.locations) * 100 / 5)}/>

        <Text>Connect with more than 15 friends</Text>
        <Progress colorScheme='orange' size='sm' value={Math.round(numberFriends * 100 / 15)}/>
      </Stack>
    </Flex>
  )
}