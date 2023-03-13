
import React, { useState, useEffect } from 'react';
import {  Button, ChakraProvider, Image, Input, InputGroup, Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';
import './App.css';
import List from './components/List';
import Login from './components/login/Login';
import { useSession } from "@inrupt/solid-ui-react";
import { ProfileView } from './components/ProfileInfo';
import Menu from './components/Menu';
import lomap_logo from "./lomap_logo.png"



function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [selectedView, setselectedView] = useState<string>("none")

  const session = useSession();

  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setCoordinates({lat: latitude , lng : longitude});
    })
  },[]);

  const handleSubmit = async (e) => {
    //TODO refactor this once the restapi implementation is working
    e.preventDefault(); //if not used, the page will reload and data will be lost
    session.login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: "https://inrupt.net", // redirect to the url
      clientName: "Lo Map",
    });
  };

  //here is where we have to insert the different views that the menu will triger,
  //see the onclick method on the menu.tsx buttons on how to modify this dictionary to include the 
  //rest of the views
  const views: { [id: string]: JSX.Element; } = {
    "none" : <></>,
    "list": <List places={locations} isLoading= {isLoading} />,
    "profile" : <ProfileView webId={session.session.info.webId}></ProfileView>
 }; 

  //previous way of deleting 
  //<button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
  //TODO delet this one implemented the correct deletion

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
            {/* <List places={locations} isLoading= {isLoading} /> */}
            <Map center = {coordinates} locations={locations}/>
            {
              selectedView ? 
              views[selectedView]
              :
              <></>
            }
            <Menu changeViewTo= {(newView : string) => {setselectedView(newView)}}/>
            <Login></Login>
        </Flex>
      </ChakraProvider>
    </>
   
  );
}

export default App;
