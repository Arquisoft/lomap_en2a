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
import AddLocationForm from './components/locations/AddLocationForm';
import ListOfLocations from './components/locations/ListOfLocations';
import Friends from './components/friends/Friends';
import LocationInfo from './components/locations/LocationInfo';
import { ProfileView } from './components/profile/ProfileInfo';
import { useSession } from '@inrupt/solid-ui-react';


function App(): JSX.Element {
  const session = useSession(); 
  const [userCoordinates, setUserCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  // const [selectedView, setselectedView] = useState<JSX.Element>(<></>); //TODO 
  const [nameSelectedView, setNameSelectedView] = useState<string>("Map");
  
  //information on the clicked coordinates stored here
  const [clickedCoordinates, setClickedCoordinates] = useState<string>("");
  //information on the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<Location>(undefined!);
  

  
  const modifyViewToBe = (viewName : string) => {
    setNameSelectedView(viewName);
    //setselectedView(views[viewName]);
  }

  useEffect(()=> {
    //we force the addlocation componet to update when the clicked coordinates change
    console.log("clicked coordinates changed in app");
    console.log(clickedCoordinates)
    
  },[clickedCoordinates]);



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
      //setselectedView(<></>);
    }
  }



  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(({coords : {latitude,longitude}}) =>{
      //we set the coordinates to be the ones of the user for them to be passed to the map
      setUserCoordinates({lat: latitude , lng : longitude});
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
                 changeViewTo={(viewName : string)=> {setNameSelectedView(viewName)}}
                 setClickedCoordinates={setClickedCoordinates}
                 clickedCoordinates={clickedCoordinates}
                 selectedView={nameSelectedView}
              />
            {
              (() => {
                switch (nameSelectedView) {
                  case "Map":
                    return <></>;
                  case "AddLocationForm":
                    return (
                      <AddLocationForm
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        loadLocations={loadLocations}
                        clickedCoordinates={clickedCoordinates}
                        setClickedCoordinates={setClickedCoordinates}
                      />
                    );
                  case "ListOfLocations":
                    return (
                      <ListOfLocations
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        places={locations}
                        loadLocations={loadLocations}
                        setSelectedLocation={setSelectedLocation}
                      />
                    );
                  case "Friends":
                    return (
                      <Friends
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                      />
                    );
                  case "ProfileView":
                    return (
                      <ProfileView
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        locations={locations}
                      />
                    );
                  case "LocationInfo":
                    return (
                      <LocationInfo
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        location={selectedLocation}
                        loadLocations={loadLocations}
                      />
                    );
                  default:
                    return null;
                }
              })()
            }

            <Menu loadLocations={loadLocations}
                  changeViewTo={(viewName : string)=> {setNameSelectedView(viewName)}}
                  locations = {locations}
                  clickedCoordinates = {clickedCoordinates}
                  setClickedCoordinates = {setClickedCoordinates}
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