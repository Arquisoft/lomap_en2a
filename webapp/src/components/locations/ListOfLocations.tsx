import { useEffect, useState } from 'react';
import { Location } from '../../types/types'
import { useSession } from '@inrupt/solid-ui-react';
import {Flex,Button,Box,VStack,Text, Icon, CloseButton,Divider,Tabs,TabList,Tab,TabPanels,TabPanel} from "@chakra-ui/react";
import  LocationCard  from './LocationCard';
import {MdOutlineLocationOff,MdEmojiPeople , } from 'react-icons/md'
import {IoPeople} from 'react-icons/io5' 
import {TbShareOff} from 'react-icons/tb'



type ListProps = {
    ownLocations : Array<Location>,
    friendLocations : Array<Location>,
    setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
    loading: boolean
}
function ProcessedFriendLocations(props : ListProps): JSX.Element {
    
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
        !props.loading?
        (   
        <>{
            //if loaded and we have friend locations
            props.friendLocations.length > 0?
            (
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                {
                    props.friendLocations && props.friendLocations.map((place,i) => 
                    <LocationCard place={place} key={i} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>)
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
            <Text>Loading</Text>
        )
        )
    }
}

function ProcessedOwnLocations(props : ListProps): JSX.Element {
    console.log(props)
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
        !props.loading?
        (   
        <>{  
            //if loaded and we have own locations
            props.ownLocations.length > 0?
            (
                
                <Flex flex={1} overflowY={'auto'} overflowX='clip' direction={'column'} >
                {
                    props.ownLocations && props.ownLocations.map((place,i) => 
                    <LocationCard place={place} key={i} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>)
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
            <Text>Loading</Text>
        </>)
        )
    }
}

function ListOfLocations(props : ListProps) : JSX.Element {

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
        { 
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
                    <ProcessedOwnLocations loading={props.loading} ownLocations={props.ownLocations} friendLocations={props.friendLocations} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>
                </TabPanel>
                <TabPanel>
                    <ProcessedFriendLocations loading={props.loading} ownLocations={props.ownLocations} friendLocations={props.friendLocations} setSelectedView={props.setSelectedView} loadLocations={props.loadLocations}/>
                </TabPanel>
                
            </TabPanels>
            </Tabs>
        }
    </Flex>);
}
export default ListOfLocations;