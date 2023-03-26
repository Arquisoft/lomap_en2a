import React, { useState } from 'react'
import { Flex, Button, Icon, Text, IconButton, ButtonGroup, Box } from "@chakra-ui/react";
import { MdList, MdLocationOn, MdMap, MdOutlineOpenInBrowser, MdPeopleAlt, MdPerson } from "react-icons/md"
import { start } from 'repl';
import { Location } from '../../../restapi/locations/Location';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import List from './List';
import { createLocation } from '../solid/solidManagement';
import AddLocationForm from './AddLocationForm';
import Friends from './Friends';
import { ProfileView } from './ProfileInfo';

type MenuProps = {
  setSelectedView: (view: JSX.Element) => void,
  locations : Array<Location>,
  session : SessionInfo
}

function Menu(props: MenuProps): JSX.Element {
  const [insideMenu, setinsideMenu] = useState(false)

  return (
    <Flex direction={'column'}
          bg={'white'}
          width={"fit-content"}
          minWidth={"5vw"}
          height={"100vh"}
          position={'absolute'}
          left={0}
          top={0}
          bottom={-4}
          zIndex={1}
          overflow='hidden'
          px={2}
          onMouseOver={()=> {setinsideMenu(true)}}
          onMouseLeave={() => { setinsideMenu(false)}}
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
                <Button leftIcon={<Icon as={MdMap} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                        bg={'white'}
                        color={'black'}
                        size='lg'
                        height={'5vh'}
                        onClick={() => { setinsideMenu(false); props.setSelectedView(<></>); }}>
                  Visualización del mapa
                </Button>
              </Box>

              <Box>
                <Button leftIcon={<Icon as={MdList} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                        bg={'white'}
                        color={'black'}
                        size='lg'
                        onClick={() => {
                          setinsideMenu(false);
                          props.setSelectedView(
                            <List setSelectedView={(view)=> props.setSelectedView(view)} places={props.locations} 
                              /*TODO check el loading*/ isLoading= {false} />
                            );
                        }}>
                  Listado de Localizaciones
                </Button>
              </Box>

              <Box>
                <Button leftIcon={<Icon as={MdLocationOn} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                        bg={'white'}
                        color={'black'}
                        size='lg'
                        onClick={
                          () => {
                            setinsideMenu(false);
                            props.setSelectedView(
                              <AddLocationForm onSubmit={
                                (location:Location) => {
                                  props.locations.push(location);
                                  createLocation(props.session.session.info.webId as string, location);
                              }}/>
                            );
                          }
                        }>
                  Añadir Localización
                </Button>
              </Box>

              <Box>
                <Button leftIcon={<Icon alignContent={'left'} as={MdPeopleAlt} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                        bg={'white'}
                        color={'black'}
                        size='lg'
                        onClick={() => {
                          setinsideMenu(false);
                          props.setSelectedView(
                            <Friends session={props.session}/>
                          );
                        }}
                >
                  Añadir amigos
                </Button>
              </Box>

              <Box marginTop={'auto'}>
                <Button leftIcon={<Icon as={MdPerson} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                        bg={'white'}
                        color={'black'}
                        size='lg'
                        onClick={() => {
                          setinsideMenu(false);
                          props.setSelectedView(
                            <ProfileView webId={props.session.session.info.webId}></ProfileView>
                          );
                        }}
                >
                  Perfil
                </Button>
              </Box>
            </Flex>
          )
          :
          (
            <Flex
              direction={'column'}
              bg={'white'}
              width={"fit-content"}
              minWidth={"5vw"}
              height={"100vh"}
              position={'absolute'}
              left={0}
              top={3}
              zIndex={1}
              overflow='hidden'
              px={2}
              alignItems='center'
            >
              <Box height={'5vh'}><Icon as={MdMap} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} /></Box>
              <Box height={'5vh'}><Icon as={MdList} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} /></Box>
              <Box height={'5vh'}><Icon as={MdLocationOn} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} /></Box>
              <Box height={'5vh'}><Icon as={MdPeopleAlt} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} /></Box>
              <Box height={'7vh'} marginTop='auto' ><Icon as={MdPerson} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} /></Box>
            </Flex>
          )
      }
    </Flex>
  );
}
export default Menu;

