import { Location } from '../../../restapi/locations/Location'
import {Flex, Box} from "@chakra-ui/react";
import {  SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import  LocationCard  from './LocationCard';

type ListProps = {
    places : Array<Location>;
    setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
}

function ListOfLocations(props : ListProps) : JSX.Element {

   if(props.places.length === 0)
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
          borderRight={"1px solid black"}
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
        overflow='auto'
        px={2}
        >
        <Flex flex={1} overflowY={'auto'} overflowX='clip' mt={16} direction={'column'}>
        {
            props.places && props.places.map((place,i) => <LocationCard place={place} key ={i} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>)
        }
        </Flex>
    </Flex>);
}
export default ListOfLocations;