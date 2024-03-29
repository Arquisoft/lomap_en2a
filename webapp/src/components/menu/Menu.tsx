import React, { useState } from 'react'
import { Flex, Button, Icon, Box, Text } from "@chakra-ui/react";
import { MdList, MdLocationOn, MdMap, MdPeopleAlt, MdPerson, MdQuestionMark, MdOutlineSportsEsports } from "react-icons/md"
import { Location } from '../../types/types';
import ListOfLocations from '../locations/ListOfLocations';
import AddLocationForm from '../locations/AddLocationForm';
import Friends from '../friends/Friends';
import { ProfileView } from '../profile/ProfileInfo';
import {GamePanel} from '../game/GamePanel'
import App from '../../App';
import {TutorialModalDialog} from "../dialogs/TutorialModalDialog";


type MenuProps = {
  changeViewTo: (view: string) => void,
  ownLocations : Array<Location>,
  friendLocations : Array<Location>,
  loadLocations : () => Promise<void>,
  loadUserLocations: () => Promise<void>
  loading: boolean
  clickedCoordinates : string
  setClickedCoordinates : (coordinates : string) => void
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
          onClick={()=> insideMenu? ()=>{} : setinsideMenu(true)}
          onMouseLeave={()=> {setinsideMenu(false)}}
    >
      {
        insideMenu ?
          (
            <Flex direction={'column'}
                  bg={'white'}
                  width={"fit-content"}
                  minWidth={"5%"}
                  height={"100%"}
                  left={0}
                  top={0}
                  zIndex={1}
                  overflow='hidden'
                  px={2}
                  alignItems='left'
                  marginTop={'3%'}
                  id='smallContainer'
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
                  onClick={() => { setinsideMenu(false); props.changeViewTo('Map'); }}>
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
                    'ListOfLocations'
                    );
                }}>
                  List of Locations
                </Button>
              </Box>

              <Box>
                <Button 
                data-testid={'Add Location'}
                leftIcon={<Icon as={MdLocationOn} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={
                  () => {
                    setinsideMenu(false);
                    props.changeViewTo(
                      'AddLocationForm'
                    );
                  }
                }>
                  Add Location
                </Button>
              </Box>

              <Box>
                <Button
                data-testid={'Add Friends'}
                leftIcon={<Icon alignContent={'left'} as={MdPeopleAlt} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    'Friends'
                  );
                }}
                >
                  Add Friends
                </Button>
              </Box>

              <Box>
                <Button
                data-testid={'Progress'}
                leftIcon={<Icon alignContent={'left'} as={MdOutlineSportsEsports} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    `GameView`
                  );
                }}
                >
                  Progress
                </Button>
              </Box>

              <Box marginTop={'auto'}>
                <TutorialModalDialog></TutorialModalDialog>
              </Box>

              <Box>
                <Button
                data-testid={'Profile'}
                leftIcon={<Icon as={MdPerson} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={() => {
                  setinsideMenu(false);
                  props.changeViewTo(
                    'ProfileView'
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
              id='smallContainer'
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
              <Flex direction='row' gap='2' alignItems={'center'} id='addLocationIcon'>
                <Icon as={MdLocationOn} width='3em' height={'2.5vw'} cursor={'pointer'}/> 
              </Flex>
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdPeopleAlt} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdOutlineSportsEsports} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex marginTop='auto' marginBottom={'2'} direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdQuestionMark} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
              <Flex marginBottom={'2'} direction='row' gap='2' alignItems={'center'}>
                <Icon as={MdPerson} width='3em' height={'2.5vw'} cursor={'pointer'}/>
              </Flex>
            </Flex>
          )
      }
    </Flex>
  );
}
export default Menu;

