import React, { useState } from 'react'
import { Flex, Button, Icon, Box, Text } from "@chakra-ui/react";
import { MdList, MdLocationOn, MdMap, MdPeopleAlt, MdPerson, MdShareLocation } from "react-icons/md"
import { Location } from '../../types/types';
import ListOfLocations from '../locations/ListOfLocations';
import AddLocationForm from '../locations/AddLocationForm';
import Friends from '../friends/Friends';
import { ProfileView } from '../profile/ProfileInfo';


type MenuProps = {
  changeViewTo: (view: JSX.Element) => void,
  locations : Array<Location>,
  loadLocations : () => Promise<void>
}



function Menu(props: MenuProps): JSX.Element {
  const [insideMenu, setinsideMenu] = useState(false)

  return (
    <Flex 
          data-testid='bigContainer'
          direction={'column'}
          bg={'white'}
          width={"fit-content"}
          height={"100%"}
          position={'absolute'}
          left={0}
          top={0}
          bottom={-4}
          zIndex={1}
          overflow='hidden'
          borderRightWidth={'thin'}
          px={2}
          boxShadow ='lg'
          onClick={()=> insideMenu? setinsideMenu(false) : setinsideMenu(true)}
    >
      {
        insideMenu ?
          (
            <Flex direction={'column'}
                  bg={'white'}
                  width={"fit-content"}
                  minWidth={"5vw"}
                  height={"100vh"}
                  left={0}
                  top={0}
                  zIndex={1}
                  overflow='hidden'
                  px={2}
                  alignItems='left'
                  marginTop={3}
            >
              <Box>
                <Button
                  data-testid={'Map View'}
                  leftIcon={<Icon as={MdMap} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                  bg={'white'}
                  color={'black'}
                  size='lg'
                  width={'fi-content'}
                  height={'5vh'}
                  onClick={() => { setinsideMenu(false); props.changeViewTo(<></>); }}>
                  Map View
                </Button>
              </Box>

              <Box>
                <Button
                data-testid={'List of Locations'} 
                leftIcon={<Icon as={MdList} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    <ListOfLocations setSelectedView={(view)=> props.changeViewTo(view)} places={props.locations} loadLocations={props.loadLocations} />
                    );
                }}>
                  List of Locations
                </Button>
              </Box>

              <Box>
                <Button 
                data-testid={'Add location'}
                leftIcon={<Icon as={MdLocationOn} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={
                  () => {
                    setinsideMenu(false);
                    props.changeViewTo(
                      <AddLocationForm setSelectedView={(view)=> props.changeViewTo(view)} loadLocations={props.loadLocations} clickedCoords={''}/>
                    );
                  }
                }>
                  Add Location
                </Button>
              </Box>

              <Box>
                <Button
                data-testid={'Add friends'}
                leftIcon={<Icon alignContent={'left'} as={MdPeopleAlt} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    <Friends setSelectedView={(view)=> props.changeViewTo(view)}/>
                  );
                }}
                >
                  Add friends
                </Button>
              </Box>

              <Box marginTop={'auto'}>
                <Button 
                data-testid={'Profile'}
                leftIcon={<Icon as={MdPerson} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    <ProfileView setSelectedView={(view)=> props.changeViewTo(view)} locations={props.locations}></ProfileView>
                  );
                }}
                >
                  Profile
                </Button>
              </Box>
            </Flex>
          )
          :
          (
            <Flex
              data-testid='smallContainer'
              direction={'column'}
              bg={'white'}
              width={"60px"}
              height={"100%"}
              left={0}
              top={3}
              zIndex={1}
              overflow='hidden'
              px={2}
              alignItems='left'
            >
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdMap} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdList} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdLocationOn} width='3em' height={'2.5vw'} cursor={'pointer'}/> 
              </Flex>
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdPeopleAlt} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex marginTop='auto' marginBottom={'2'} direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdPerson} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
            </Flex>
          )
      }
    </Flex>
  );
}
export default Menu;

