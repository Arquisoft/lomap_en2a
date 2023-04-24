// External imports
import React, { useState, useEffect } from 'react';
import { ChakraProvider, HStack, Input, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";

// Our imports
import './App.css';
import { Location } from './types/types';
import Login from './components/login/Login';
import Map from './components/map/Map';
import {createLocation, deleteLocation, getLocations,getSolidFriends,getFriendsID} from './solid/solidManagement'
import Menu from './components/menu/Menu';
import { useSession } from '@inrupt/solid-ui-react';


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);
  const [session, setSession] = useState(useSession());

  const [isLoggedIn, setIsLoggedIn] = useState(true)


  const getNewLocation = (location:Location) => {
    locations.push(location);
    createLocation(session.session.info.webId as string, location);
  }

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    loadLocations();
  },[session.session.info.isLoggedIn]);

  async function loadUserLocations(){
    let locList = locations;
    if(session.session.info.webId){
      let list = await getLocations(session.session.info.webId)
      locList = locList.concat(list)
    }
    setLocations(locList);
    setselectedView(<></>);
  }

  async function loadLocations(){
    if(session.session.info.webId){
      let locationList = await getLocations(session.session.info.webId)
      //Friends Locations
      let friends = await getFriendsID(session.session.info.webId);

      const requests = friends.map(friend => getLocations(friend as string));
    
      const results = await Promise.all(requests);
      for(let locArray of results){
        locationList = locationList.concat(locArray);
      }
    //  locationList.concat(results);
      /**for (let friend of friends){ //WORKING
        let locations = await getLocations(friend.webID as string)
        locationList= locationList.concat(locations);
      }
      */
      setLocations(locationList);
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
                 locations={locations}
                 changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
                loadUserLocations={loadUserLocations}
              />
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu loadLocations={loadLocations}
                  changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
                  locations = {locations}
                  loadUserLocations={loadUserLocations}
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