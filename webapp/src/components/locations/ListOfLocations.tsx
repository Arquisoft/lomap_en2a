import { Location } from '../../types/types'
import { useSession } from '@inrupt/solid-ui-react';
import {Flex,VStack,Text, Icon, CloseButton,Divider,Tabs,TabList,Tab,TabPanels,TabPanel} from "@chakra-ui/react";
import  LocationCard  from './LocationCard';
import {MdOutlineLocationOff,MdEmojiPeople , } from 'react-icons/md'
import {IoPeople} from 'react-icons/io5' 



type ListProps = {
    ownLocations : Array<Location>,
    friendLocations : Array<Location>,
    setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
}

function ListOfLocations(props : ListProps) : JSX.Element {
    const allLocations = props.ownLocations.concat(props.friendLocations);
    const session = useSession();
   if(allLocations.length === 0)
    return(
        <Flex
          data-testid ='loadingView'
          direction={'column'}
          bg={'white'}
          width={"30vw"}
          height={"100%"}
          position={'absolute'} 
          left={'3%'}
          top={0}
          zIndex={1}
          borderRight={"1px solid black"}
          overflow='hidden'
          px={2}
          alignItems={'center'}
          justifyContent={'center'}
          >
            <CloseButton 
                onClick={() => props.setSelectedView(<></>)}
                position='absolute'
                top='2'
                right='2'
            ></CloseButton>
            <VStack width='25vw' align-items='center' bgColor='blackAlpha.50' borderRadius='lg' padding='2em'>
                <Text as='b' fontSize='3xl' color='blue'>Ups</Text>
                <Text >No locations found on your pod, open tutorial and start creating some locations for them to be displayed here.</Text>
                <Icon as={MdOutlineLocationOff} color='red' width={'5em'} height={'5em'} minHeight={'10px'} minWidth={'10px'} />
            </VStack>
        </Flex>
    );

    return(
    <Flex
        direction={'column'}
        bg={'white'}
        width={"30%"}
        height={"100%"}
        position={'absolute'} 
        left={'3%'}
        top={0}
        zIndex={1}
        overflow='auto'
        px={'2%'}
        >
        <CloseButton 
                onClick={() => props.setSelectedView(<></>)}
                position='absolute'
                top='2%'
                right='2%'
        ></CloseButton>
        <Text as='b' fontSize='3xl' marginTop={'2%'} marginLeft={'5%'}>List of Locations</Text>
        <Divider marginTop={'2%'} marginBottom={'2%'} borderWidth={'2px'} borderRadius={"lg"} width='100%'/> 
        <Tabs isFitted={true} variant='enclosed' >
          <TabList>
            <Tab as='b' >
                <Icon as={MdEmojiPeople} color='black' minHeight={'10px'} minWidth={'10px'} marginRight='1.1em' />
                Your locations
            </Tab>
            <Tab as='b'>
                <Icon as={IoPeople} color='black' minHeight={'10px'} minWidth={'10px'} marginRight='1.1em' />
                Friend Locations
            </Tab>
          </TabList>
          <TabPanels alignSelf='center'>
            <TabPanel>
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                {
                    props.ownLocations && props.ownLocations.map((place,i) => 
                    <LocationCard place={place} key={i} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>)
                }
                </Flex>
            </TabPanel>
            <TabPanel>
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                {
                    props.friendLocations && props.friendLocations.map((place,i) => 
                    <LocationCard place={place} key={i} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>)
                }
                </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </Flex>);
}
export default ListOfLocations;