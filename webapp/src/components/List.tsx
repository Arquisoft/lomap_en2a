import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Flex, Box} from "@chakra-ui/react";
import {  SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import  PlaceDetail  from './PlaceDetail';

type ListProps = {
    places : Array<Location>;
    isLoading : boolean;
    changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
}

function List(props : ListProps) : JSX.Element {
    if(props.isLoading)return(
        <Flex
          direction={'column'}
          bg={'white'}
          width={"30vw"}
          height={"100vh"}
          position={'absolute'} 
          left={'5vw'}
          top={0}
          zIndex={1}
          overflow='hidden'
          px={2}
          >
            <Box padding ="6" boxShadow ='lg' bg='white' mt={3}>
                <SkeletonCircle size = '10'/>
                <SkeletonText mt='4' noOfLines={4} spacing='4'/>
            </Box>

            <Box padding ="6" boxShadow ='lg' bg='white' mt={3}>
                <SkeletonCircle size = '10'/>
                <SkeletonText mt='4' noOfLines={4} spacing='4'/>
            </Box>

            <Box padding ="6" boxShadow ='lg' bg='white' mt={3}>
                <SkeletonCircle size = '10'/>
                <SkeletonText mt='4' noOfLines={4} spacing='4'/>
            </Box>

            <Box padding ="6" boxShadow ='lg' bg='white' mt={3}>
                <SkeletonCircle size = '10'/>
                <SkeletonText mt='4' noOfLines={4} spacing='4'/>
            </Box>
        </Flex>
    );

    return(
    <Flex
        direction={'column'}
        bg={'white'}
        width={"30vw"}
        height={"100vh"}
        position={'absolute'} 
        left={'5vw'}
        top={0}
        zIndex={1}
        overflow='hidden'
        px={2}
        >
        <Flex flex={1} overflowY={'scroll'} mt={16} direction={'column'}>
        {
            props.places && props.places.map((place,i) => <PlaceDetail changeViewTo={props.changeViewTo} place={place} key ={i}/>)
        }
        </Flex>
    </Flex>);
}
export default List;