import { useEffect, useState } from 'react';
import { Location } from '../../types/types'

import {Flex,VStack,Text, Icon, CloseButton,Divider,Tabs,TabList,Tab,TabPanels,TabPanel} from "@chakra-ui/react";
import  LocationCard  from './LocationCard';
import {MdOutlineLocationOff,MdEmojiPeople , } from 'react-icons/md'
import {IoPeople} from 'react-icons/io5' 
import {TbShareOff} from 'react-icons/tb'
import {BsClockHistory} from 'react-icons/bs'



type ListProps = {
    ownLocations : Array<Location>,
    friendLocations : Array<Location>,
    setSelectedView: (viewName: string) => void //function to change the selected view on the left
    setSelectedLocation: (location: Location) => void
    loadLocations: () => Promise<void>
    loadingOwnLocations: boolean
    loadingFriendLocations: boolean
}

function ListOfLocations(props : ListProps) : JSX.Element {
    const loadLocations = props.loadLocations;
    const setSelectedView = props.setSelectedView;
    const [ownLocations, setownLocations] = useState(props.ownLocations)
    const [friendLocations, setfriendLocations] = useState(props.friendLocations)
    const [loadingOwnLocations, setLoadingOwnLocations] = useState(props.loadingOwnLocations)
    const [loadingFriendLocations, setLoadingFriendLocations] = useState(props.loadingFriendLocations)
  
    useEffect(() => {
      setownLocations(props.ownLocations)
      setfriendLocations(props.friendLocations)
      setLoadingOwnLocations(props.loadingOwnLocations)
      setLoadingFriendLocations(props.loadingFriendLocations)
    }, [props.ownLocations, props.friendLocations, props.loadingOwnLocations, props.loadingFriendLocations])

    function ProcessedFriendLocations(): JSX.Element {
    
        {
             /*
                We display the two sections of the location list according to the data received.
                We take into account the loading information and the number of own and friend locations.
                If loaded:
                    If friend locations:
                        Display friend locations
                    Else:
                        Display message indicating that friends have not shared locations
                If loading:
                    Display loading information to the user
            */
            return(
            //if not loading
            !loadingFriendLocations?
            (   
            <>{
                //if loaded and we have friend locations
                friendLocations.length > 0?
                (
                    <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                    {
                        friendLocations && friendLocations.map((place,i) => 
                        <LocationCard setSelectedLocation={props.setSelectedLocation} place={place} key={i} setSelectedView={setSelectedView} loadLocations={loadLocations}/>)
                    }
                    </Flex>
                )
                : //if loaded and we don't have friend locations
                (
                <VStack width='25vw' align-items='center' bgColor='blackAlpha.50' borderRadius='lg' padding='2em'>
                    <Text as='b' fontSize='3xl' color='blue'>Ups</Text>
                    <Text >Seems like no friend of yours shared a location with you. Make sure you check the tutorial on how to add friends and share locations to start seeing some locations here.</Text>
                    <Icon as={TbShareOff} color='grey' width={'5em'} height={'5em'} minHeight={'10px'} minWidth={'10px'} />
                </VStack>
                )
            }</>
            )
            : //if loading
            (
                
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} align='center' justify='center' gap='1.2em'>
                    <Text 
                    textAlign='center'
                    fontSize='2em'
                    as={'b'}
                    >Loading...</Text>
                    <Icon as={BsClockHistory} color='blue.500' width={'5em'} height={'5em'} minHeight={'10px'} minWidth={'10px'} />
                    <Text>
                        Loading your friends locations
                    </Text>
                </Flex>
            )
            )
        }
    }
    
    function ProcessedOwnLocations(): JSX.Element {
        {
             /*
                We display the two sections of the location list according to the data received.
                We take into account the loading information and the number of own locations
                If loaded:
                    If own locations:
                        Display own locations
                    Else:
                        Display message indicating to add locations
                If loading:
                    Display loading information to the user
            */
            return(
            //if not loading
            !loadingOwnLocations?
            (   
            <>{  
                //if loaded and we have own locations
                ownLocations.length > 0?
                (
                    
                    <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                    {
                        ownLocations && ownLocations.map((place,i) => 
                        <LocationCard setSelectedLocation={props.setSelectedLocation} place={place} key={i} setSelectedView={setSelectedView} loadLocations={loadLocations}/>)
                    }
                    </Flex>
                    
                )
                : //if we do not have own locations
                (
                <VStack width='25vw' align-items='center' bgColor='blackAlpha.50' borderRadius='lg' padding='2em'>
                    <Text as='b' fontSize='3xl' color='blue'>Ups</Text>
                    <Text >Seems like no locations stored on your pod, take a look at the tutorial on how to create locations for them to be displayed here.</Text>
                    <Icon as={MdOutlineLocationOff} color='grey' width={'5em'} height={'5em'} minHeight={'10px'} minWidth={'10px'} />
                </VStack>
                )
            }</>
            )
            : //if loading
            (<>
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} align='center' justify='center' gap='1.2em'>
                    <Text 
                    textAlign='center'
                    fontSize='2em'
                    as={'b'}
                    >Loading...</Text>
                    <Icon as={BsClockHistory} color='blue.500' width={'5em'} height={'5em'} minHeight={'10px'} minWidth={'10px'} />
                    <Text>
                        Loading your locations
                    </Text>
                </Flex>
            </>)
            )
        }
    }

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
            
        
    
        <Flex direction='column'>
            <Text marginTop='4%' width='fit-content' 
            fontSize='2.2em' alignSelf='center' borderBottomWidth='1px'>List of locations</Text>
            <Flex direction={'column'}>
                <CloseButton 
                    data-testid='closeButton'
                    onClick={() => {
                        props.setSelectedView('Map') }}
                    position='absolute'
                    top='2%'
                    right='3%'
                ></CloseButton>
            </Flex>
        </Flex>
        
        <Divider marginTop={'2%'} marginBottom={'2%'} borderWidth={'2px'} borderRadius={"lg"} width='100%'/> 
        { 
            <Tabs isFitted={true} variant='enclosed' >
            <TabList>
                <Tab as='b' data-testid='myLocationsTab' >
                    <Icon as={MdEmojiPeople} color='black' minHeight={'10px'} minWidth={'10px'} marginRight='1.1em' />
                    Your locations
                </Tab>
                <Tab as='b' data-testid='friendLocationsTab'>
                    <Icon as={IoPeople} color='black' minHeight={'10px'} minWidth={'10px'} marginRight='1.1em' />
                    Friend Locations
                </Tab>
            </TabList>
            <TabPanels alignSelf='center'>
                <TabPanel>
                    <ProcessedOwnLocations/>
                </TabPanel>
                <TabPanel>
                    <ProcessedFriendLocations/>
                </TabPanel>
                
            </TabPanels>
            </Tabs>
        }
    </Flex>);
}
export default ListOfLocations;