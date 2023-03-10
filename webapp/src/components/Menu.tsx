import React,{useState} from 'react'
import {Flex, Button,Icon,Text, IconButton, ButtonGroup, Box} from "@chakra-ui/react";
import {MdList, MdLocationOn, MdMap, MdPeopleAlt, MdPerson} from "react-icons/md"
import { start } from 'repl';

type MenuProps = {
  notifyOption : (viewName:string)=>void
} 

function Menu(props : MenuProps) : JSX.Element {
    const [insideMenu, setinsideMenu] = useState(false)

   return(
        <Flex
          direction={'column'}
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
          onMouseEnter={()=>{setinsideMenu(true)}}
          onMouseLeave={()=>{setinsideMenu(false)}
          }
          >{
            insideMenu? 
            ( 
              <ButtonGroup 
                flexDirection={'column'}
                marginTop={3}
                flex='100vh'>
                <Button
                  leftIcon={<Icon as={MdMap} width='max-content' height={'3vw'}/>}
                  bg={'white'}
                  color={'black'}
                  size='lg'
                  height={'5vh'}
                  onClick={()=>{setinsideMenu(false); props.notifyOption("none"); }}
                  >
                  Visualización del mapa
                </Button>

                <Button
                  leftIcon={<Icon as={MdList}  width='max-content' height={'3vw'}/>}
                  bg={'white'}
                  color={'black'}
                  size='lg'
                  onClick={()=>{
                    setinsideMenu(false);
                    props.notifyOption("list"); }}
                >
                  Listado de Localizaciones
                </Button>

                <Button
                  leftIcon={<Icon as={MdLocationOn}  width='max-content' height={'3vw'}/>}
                  bg={'white'}
                  color={'black'}
                  size='lg'
                
                >
                  Añadir Localización
                </Button>
                <Button
                  leftIcon={<Icon as={MdPeopleAlt}  width='max-content' height={'3vw'}/>}
                  bg={'white'}
                  color={'black'}
                  size='lg'
                
                >
                  Añadir amigos
                </Button>
                <Box
                  marginTop={'auto'}
                  >
                  <Button
                    leftIcon={<Icon as={MdPerson}  width='max-content' height={'3vw'}/>}
                    bg={'white'}
                    color={'black'}
                    size='lg'
                    width={'max'}
                  >
                    Perfil
                  </Button>
                </Box>
              </ButtonGroup>
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
                >
                  <Box height={'5vh'}><Icon as={MdMap} width='max-content' height={'3vw'}/></Box>
                  <Box height={'5vh'}><Icon as={MdList} width='max-content' height={'3vw'}/></Box>
                  <Box height={'5vh'}><Icon as={MdLocationOn} width='max-content' height={'3vw'}/></Box>
                  <Box height={'5vh'}><Icon as={MdPeopleAlt} width='max-content' height={'3vw'}/></Box>
                  <Box height={'5vh'} marginTop='auto' ><Icon as={MdPerson} width='max-content' height={'3vw'}/></Box>
              </Flex>
            )
          }
        </Flex>
    );
}
export default Menu;

