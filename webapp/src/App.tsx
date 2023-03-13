
import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';
import './App.css';
import List from './components/List';
import axios  from 'axios';
import Login from './components/login/Login';
import {getLocations} from './solid/solidManagement'


import Menu from './components/Menu';
import { useSession } from '@inrupt/solid-ui-react';

import Friends from './components/Friends';

function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [selectedView, setselectedView] = useState<string>("none")

  const session = useSession();

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    //TODO refactor once restapi controls locations
    // axios.get( "http://localhost:5000/locations/getAll"
    //   ).then ((response) =>{
    //     console.log(response)
    //     if(response.status === 200){ //if no error
    //       setLocations(response.data); //we store the locations retrieved
    //       setIsLoading(false);
    //       console.log(locations)
    //     }
    //   }).catch((error) =>{
    //     //an error occurred while sending the request to the restapi
    //     setIsLoading(true)
    //     setLocations([]);
    //   });
    console.log(session)
    if(session.session.info.webId){
      getLocations(session.session.info.webId).then((result)=>{setLocations(result); setIsLoading(false);  console.log(result)});
    }
  },[session.session.info.isLoggedIn]);
 

  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setCoordinates({lat: latitude , lng : longitude});
    })
  },[]);

  //here is where we have to insert the different views that the menu will triger,
  //see the onclick method on the menu.tsx buttons on how to modify this dictionary to include the 
  //rest of the views
  const views: { [id: string]: JSX.Element; } = {
    "none" : <></>,
    "list": <List places={locations} isLoading= {isLoading} />,

    "friends": <Friends webId={session.session.info.webId} session={session}/>
 }; 

  return (
    <>
      <ChakraProvider>
        <Login></Login>
        <Flex
          justifyContent={'center'}
          alignItems={'center'}
          width={'100vw'}
          height={'100vh'}
          maxWidth={'100vw'}
          maxHeight={'100vh'}
          position={'relative'}
          >       
            {
              selectedView ? 
              views[selectedView]
              :
              <></>
            }
            <Map center = {coordinates} locations={locations}/>
            <Menu changeViewTo= {(newView : string) => {setselectedView(newView)}}/>
        </Flex>
      </ChakraProvider>
    </>
   
  );

}

export default App;
