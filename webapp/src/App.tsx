import React, { useState, useEffect } from 'react';
import {  Button, ChakraProvider, Image, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';

import './App.css';
import List from './components/List';
import AddLocationForm from "./components/AddLocationForm";
import axios  from 'axios';
import Login from './components/login/Login';
import {getLocations, createLocation} from './solid/solidManagement'


import Menu from './components/Menu';
import { useSession } from '@inrupt/solid-ui-react';
import { ProfileView } from './components/ProfileInfo';

import Friends from './components/Friends';

function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);
  //shortcut to define views that do not vary from the menu see map called 'views'
  const [nameOfSelectedView, setNameOfSelectedView] = useState<string>("none");
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);


  const getNewLocation = (location:Location) => {
    // console.log("coming from AddLocation", location)
    locations.push(location);
    createLocation(session.session.info.webId as string, location);
    // console.log(locations);
  }

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
    "list": <List changeViewTo={(view)=>setselectedView(view)} places={locations} isLoading= {isLoading} />,
    "addLocation": <AddLocationForm onSubmit={getNewLocation}/>,
    "friends": <Friends webId={session.session.info.webId} session={session}/>,
    "profile" : <ProfileView webId={session.session.info.webId}></ProfileView>
 };

 /*
  This effect triggered when name of the view is changed will set the current selected view to the one
  in the map of views
 */
  useEffect(() => {
    console.log("Cambio a: " +  nameOfSelectedView)
    setselectedView(views[nameOfSelectedView])
  }, [nameOfSelectedView])

  useEffect(() => {
    
  }, [selectedView])
  
 

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
            <Map /*center = {coordinates}*/ locations={locations} 
              changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}/>
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu changeViewTo= {(newView : string) => {setNameOfSelectedView(newView)}}/>
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
