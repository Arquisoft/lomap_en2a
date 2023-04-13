// External imports
import React, { useState, useEffect } from 'react';
import { ChakraProvider, HStack, Input, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";

// Our imports
import './App.css';
import { Location } from '../../restapi/locations/Location';
import Login from './components/login/Login';
import Map from './components/Map';
import {createLocation, deleteLocation, getLocations,getSolidFriends} from './solid/solidManagement'
import Menu from './components/Menu';
import { useSession } from '@inrupt/solid-ui-react';


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);
  const [session, setSession] = useState(useSession());


  const getNewLocation = (location:Location) => {
    locations.push(location);
    createLocation(session.session.info.webId as string, location);
  }

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    loadLocations();
  },[session.session.info.isLoggedIn]);


  async function loadLocations(){
    if(session.session.info.webId){
      let locationList = await getLocations(session.session.info.webId)
      //Friends Locations
      let friends = await getSolidFriends(session.session.info.webId);

      for (let friend of friends){
        let locations = await getLocations(friend.webID as string)
        locationList= locationList.concat(locations);
      }
      setLocations(locationList);
      setselectedView(<></>);
    }
  }



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
              />
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu loadLocations={loadLocations}
                  changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
                  locations = {locations}
                  />
            {
              !session.session.info.isLoggedIn ? (
                <Login></Login>
              ) : <></>
            }

        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;