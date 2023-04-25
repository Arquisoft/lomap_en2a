// External imports
import React, { useState, useEffect } from 'react';
import { ChakraProvider, HStack, Input, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";

// Our imports
import './App.css';
import { Location } from './types/types';
import Login from './components/login/Login';
import Map from './components/map/Map';
import {createLocation, deleteLocation, getLocations,getSolidFriends} from './solid/solidManagement'
import Menu from './components/menu/Menu';
import { useSession } from '@inrupt/solid-ui-react';


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  //this state indicates if the user locations are being loaded
  const [loading, setLoading] = useState(true);
  const [ownLocations, setOwnLocations] = useState<Array<Location>>([]);
  const [friendLocations, setFriendLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);
  const [session, setSession] = useState(useSession());

  const [isLoggedIn, setIsLoggedIn] = useState(true)


  const getNewLocation = (location:Location) => {
    ownLocations.push(location);
    createLocation(session.session.info.webId as string, location);
  }

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    loadLocations();
  },[session.session.info.isLoggedIn]);


  async function loadLocations(){
    if(session.session.info.webId){
      setOwnLocations(await getLocations(session.session.info.webId));
      setLoading(false);

      //Friends Locations
      let friends = await getSolidFriends(session.session.info.webId);

      let locationList: Array<Location> = [];
      for (let friend of friends){
        let friendLocations = await getLocations(friend.webID);
        locationList = locationList.concat(friendLocations);
      }
      setFriendLocations(locationList);
    }
  }

  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setCoordinates({lat: latitude , lng : longitude});
    })
    handleRedirectAfterLogin();
  },[]);

  async function handleRedirectAfterLogin() {
    await session.session.handleIncomingRedirect(window.location.href);
    if (session.session.info.isLoggedIn) {
      setIsLoggedIn(true);
    }
    else
      setIsLoggedIn(false);
  }


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
            <Map loadLocations={loadLocations}
                 locations={ownLocations.concat(friendLocations)}
                 changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
              />
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu loadLocations={loadLocations}
                  changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
                  ownLocations = {ownLocations}
                  friendLocations = {friendLocations}
                  loading={loading}
                  />
            {
              !isLoggedIn ? (
                <Login></Login>
              ) : <></>
            }

        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;