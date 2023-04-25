// External imports
import React, { useState, useEffect } from 'react';
import { ChakraProvider, Button } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { MdAddLocationAlt } from 'react-icons/md';

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
  //if the user is in Location creation mode
  const [inLocationCreationMode, setInLocationCreationMode] = React.useState<boolean>(false);
  //information on the currently selected location
  const [selectedLocation, setSelectedLocation] = useState<Location>(undefined!);
  
  const modifyViewToBe = (viewName : string) => {
    setNameSelectedView(viewName);
    //setselectedView(views[viewName]);
  }

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
            <Map
                 locations={locations}
                 changeViewTo={(viewName : string)=> {setNameSelectedView(viewName)}}
                 setClickedCoordinates={setClickedCoordinates}
                 clickedCoordinates={clickedCoordinates}
                 selectedView={nameSelectedView}
                 setInLocationCreationMode={setInLocationCreationMode}
                 inLocationCreationMode={inLocationCreationMode}
                 setSelectedLocation={setSelectedLocation}
              />
            {
              //we define as the button (circle sized) that will be placed at the botton right corner of the map
              //and that will have the icon MdAddLocationAlt from react-icons. The button will be red and the icon will be white
              //once clicked it will toggle the state inLocationCreationMode
            }  

            <Button
              size="lg"
              borderRadius="50%"
              width="4.5em"
              height="4.5em"
              position="absolute"
              bottom="2em"
              right="4em"
              colorScheme="red"
              onClick={() => {  setInLocationCreationMode(!inLocationCreationMode) }}
            >
              <MdAddLocationAlt  size="4.5em" color={"white"}/> 
            </Button>
               
            {
              (() => {
                switch (nameSelectedView) {
                  case "Map":
                    return <></>;
                  case "AddLocationForm":
                    return (
                      <AddLocationForm
                        locations={locations}
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        loadLocations={loadLocations}
                        clickedCoordinates={clickedCoordinates}
                        setClickedCoordinates={setClickedCoordinates}
                        setInLocationCreationMode={setInLocationCreationMode}
                        setSelectedLocation={setSelectedLocation}
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