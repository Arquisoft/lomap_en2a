// External imports
import React,{ useState, useEffect } from 'react';
import { ChakraProvider, useToast,Box } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";

// Our imports
import './App.css';
import { Location } from './types/types';
import Login from './components/login/Login';
import Map from './components/map/Map';
import {createLocation, getLocations,getSolidFriends} from './solid/solidManagement'
import Menu from './components/menu/Menu';
import { useSession } from '@inrupt/solid-ui-react';

function LoadingToast({loading}) : JSX.Element{
  const toast = useToast();
  if(loading){
    toast({
      title: 'Loading locations from your pod...',
      status: 'info',
      isClosable: false,
    })
  }
  return (<></>)
}


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [loadingLocations, setloadingLocations] = useState(true);
  const [friendLocations, setFriendLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);
  const [session, setSession] = useState(useSession());

  //const toast = useToast();

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
      //we update the user's locations
      setLocations(await getLocations(session.session.info.webId))
      //we update the loading state for children components
      setloadingLocations(false);
      //we close the loading info toast
      //toast.closeAll()

      //we now try to load the friends' locations
      //Friends Locations
      let friends = await getSolidFriends(session.session.info.webId);
      let locationList : Array<Location> = [];
      for (let friend of friends){
        let locations = await getLocations(friend.webID as string)
        locationList= locationList.concat(locations);
      }
      setFriendLocations(locationList);
      //setselectedView(<></>);
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
                ownLocations = {locations}
                friendLocations = {friendLocations}
                />
          {
            !session.session.info.isLoggedIn ? (
              <Login></Login>
            ) : 
            <LoadingToast loading = {loadingLocations}></LoadingToast>
          }

      </Flex>
    </ChakraProvider>
    
  );
}

export default App;