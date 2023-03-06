import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import {Coordinates} from "../../restapi/locations/Location"

import Map from './components/Map';

import './App.css';



function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});

  return (
    <>
      <ChakraProvider>
        <Flex 
          justifyContent={'center'}
          alignItems={'center'}
          width={'100vw'}
          height={'100vh'}
          maxWidth={'100vw'}
          maxHeight={'100vh'}
          position={'relative'}
          >
          <Map/>
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;
