import React,{useState} from 'react'
import {Flex, Button,Icon,Text} from "@chakra-ui/react";
import {MdMap} from "react-icons/md"


function Menu() : JSX.Element {
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
          zIndex={1}
          overflow='hidden'
          px={2}
          onMouseOver={()=>{setinsideMenu(true)}}
          >
           <Button
             leftIcon={<Icon as={MdMap}/>}
           >
                {insideMenu ? <></>: <Text>Abrir mapa</Text> }
           </Button>
        </Flex>
    );
}
export default Menu;

