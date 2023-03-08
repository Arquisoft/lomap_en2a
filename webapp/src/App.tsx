
import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import { deleteLocation, createLocation } from './solid/solidManagement';
import Map from './components/Map';
import './App.css';
import List from './components/List';
import axios  from 'axios';
import Login from './components/login/Login';
import CreateLocation from './components/locations/add/CreateLocation';

import {useSession}  from "@inrupt/solid-ui-react";




function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);

  const session = useSession();

  useEffect(()=>{
    axios.get( "http://localhost:5000/locations/getAll"
      ).then ((response) =>{
        console.log(response)
        if(response.status === 200){ //if no error
          setLocations(response.data); //we store the locations retrieved
          setIsLoading(false);
          console.log(locations)
        }
      }).catch((error) =>{
        //an error occurred while sending the request to the restapi
        setIsLoading(true)
        setLocations([]);
      });
      
  },[]);


  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setCoordinates({lat: latitude , lng : longitude});
    })
  },[]);

  return (
    <>
      <ChakraProvider>
        <Login/>
        <CreateLocation/>
        <button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
        <Flex 
          justifyContent={'center'}
          alignItems={'center'}
          width={'100vw'}
          height={'100vh'}
          maxWidth={'100vw'}
          maxHeight={'100vh'}
          position={'relative'}
          >
            <List places={locations} isLoading= {isLoading} />
            <Map center = {coordinates} locations={locations}/>
        </Flex>
      </ChakraProvider>
    </>

  );
}

export default App;
