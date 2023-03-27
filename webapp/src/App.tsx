import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';

import './App.css';
import Login from './components/login/Login';
import {createLocation, deleteLocation, getLocations} from './solid/solidManagement'

import Menu from './components/Menu';
import { useSession } from '@inrupt/solid-ui-react';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);


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
    // console.log(session)
    loadLocations();
  },[session.session.info.isLoggedIn]);


  function loadLocations(){
    if(session.session.info.webId){
      getLocations(session.session.info.webId)
        .then((result)=>
        {
          setLocations(result);
          //we close if any selected to force reload of elements 
          //TODO improve this to have leave the same view that was before but reloaded (try with location list, if no locations loaded must be loading and if not list must appear)
          setselectedView(<></>);
        });
    }
  }

  function deleteLoc( location:Location){
    if(session.session.info.webId && location.url)
      deleteLocation(session.session.info.webId ,location.url.toString()).then(
        ()=> loadLocations()
      )
    
  }
  
  function addLocation(location:Location){
    if(session.session.info.webId)
      createLocation(session.session.info.webId ,location).then(
        ()=> loadLocations()
      )

  }


  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setCoordinates({lat: latitude , lng : longitude});
    })
  },[]);
  
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
            <Map /*center = {coordinates}*/ 
            deleteLocation={deleteLoc} 
            locations={locations} 
              changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}/>
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu deleteLoc={deleteLoc}
                  addLocation={addLocation}
                  setSelectedView= {(newView : JSX.Element) => {setselectedView(newView)}} 
                  locations = {locations}
                  session = {session}
                  />
            {
              !session.session.info.isLoggedIn ? (
                <Login session={session.session}></Login>
              ) : <></>
            }
            
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;
