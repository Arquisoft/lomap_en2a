// External imports
import  { useState, useEffect } from 'react';
import { ChakraProvider, Button, VStack } from '@chakra-ui/react';
import {Flex,HStack,Text, Spinner} from "@chakra-ui/react";
import { MdAddLocationAlt } from 'react-icons/md';

// Our imports
import './App.css';
import { Location } from './types/types';
import Login from './components/login/Login';
import Map from './components/map/Map';
import {getLocations,getFriendsID} from './solid/solidManagement'
import Menu from './components/menu/Menu';
import AddLocationForm from './components/locations/AddLocationForm';
import ListOfLocations from './components/locations/ListOfLocations';
import Friends from './components/friends/Friends';
import LocationInfo from './components/locations/LocationInfo';
import {GamePanel} from './components/game/GamePanel'
import { ProfileView } from './components/profile/ProfileInfo';
import { useSession } from '@inrupt/solid-ui-react';
import EditLocationFormComp from './components/locations/EditLocation';import {IntroductionModalDialog} from "./components/dialogs/IntroductionModalDialog";


function App(): JSX.Element {
  const session = useSession(); 
  //const [userCoordinates, setUserCoordinates] = useState({lng:0, lat:0});
  //this state indicates if the user locations are being loaded
  const [loading, setLoading] = useState(true);
  const [ownLocations, setOwnLocations] = useState<Array<Location>>([]);
  const [friendLocations, setFriendLocations] = useState<Array<Location>>([]);
  const[isLoggedIn, setIsLoggedIn] = useState(false);
  const [clickedCoordinates, setClickedCoordinates] = useState("");
  const [inLocationCreationMode, setInLocationCreationMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>(ownLocations[0]);
  const [nameSelectedView, setNameSelectedView] = useState("Map");


  // const getNewLocation = (location:Location) => {
  //   ownLocations.push(location);
  //   createLocation(session.session.info.webId as string, location);
  // }

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    if(session.session.info.isLoggedIn)
      void loadLocations();
  },[session.session.info.isLoggedIn]);

  async function loadUserLocations(){
    if(session.session.info.webId){
      await getLocations(session.session.info.webId);
      setOwnLocations(ownLocations);
    }
  }

  async function loadLocations(){
    if(session.session.info.webId){
      setOwnLocations(await getLocations(session.session.info.webId));
      setLoading(false);

      //Friends Locations
      let friends = await getFriendsID(session.session.info.webId);

      
      const requests = friends.map(friend => getLocations(friend as string));
      const results = await Promise.all(requests);

      let locationList: Array<Location> = [];

      for(let locArray of results){
        
        locArray.forEach(location =>location.isFriend = true);

        locationList = locationList.concat(locArray);
      }
      setFriendLocations(locationList);
    }
  }

  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(() =>{})
    void handleRedirectAfterLogin();
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
            <Map
                 locations={ownLocations.concat(friendLocations)}
                 changeViewTo={(viewName : string)=> {setNameSelectedView(viewName)}}
                 setClickedCoordinates={setClickedCoordinates}
                 clickedCoordinates={clickedCoordinates}
                 selectedView={nameSelectedView}
                 setInLocationCreationMode={setInLocationCreationMode}
                 inLocationCreationMode={inLocationCreationMode}
                 setSelectedLocation={setSelectedLocation}
                 selectedLocation={selectedLocation}
                loadUserLocations={loadUserLocations}
              />
            {
              //we define as the button (circle sized) that will be placed in the bottom right corner of the map
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
                        locations={ownLocations}
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        loadLocations={loadLocations}
                        loadUserLocations={loadUserLocations}
                        clickedCoordinates={clickedCoordinates}
                        setClickedCoordinates={setClickedCoordinates}
                        setInLocationCreationMode={setInLocationCreationMode}
                        setSelectedLocation={setSelectedLocation}
                      />
                    );
                    case "EditLocation":
                      return (
                        <EditLocationFormComp
                          locations={ownLocations}
                          setOwnLocations={setOwnLocations}
                          setSelectedView={(viewName: string) => {
                            setNameSelectedView(viewName);
                          }}
                          loadLocations={loadLocations}
                          loadUserLocations={loadUserLocations}
                          clickedCoordinates={clickedCoordinates}
                          setClickedCoordinates={setClickedCoordinates}
                          setInLocationCreationMode={setInLocationCreationMode}
                          setSelectedLocation={setSelectedLocation}
                          location={selectedLocation}
                        />
                      );
                  case "ListOfLocations":
                    return (
                      <ListOfLocations
                        setSelectedView={(viewName: string) => {
                          setNameSelectedView(viewName);
                        }}
                        ownLocations={ownLocations}
                        friendLocations={friendLocations}
                        loadLocations={loadLocations}
                        setSelectedLocation={setSelectedLocation}
                        loading={loading}
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
                        locations={ownLocations.concat(friendLocations)}
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
                  case 'GameView':
                    return (
                      <GamePanel
                        setSelectedView={(view)=> setNameSelectedView(view)}
                        locations={ownLocations}/>
                    );
                  default:
                    return null;
                }
              })()
            }

            <Menu loadLocations={loadLocations}
                  changeViewTo={(viewName : string)=> {setNameSelectedView(viewName)}}
                  ownLocations = {ownLocations}
                  friendLocations = {friendLocations}
                  loading={loading}
                  clickedCoordinates = {clickedCoordinates}
                  setClickedCoordinates = {setClickedCoordinates}
                  loadUserLocations={loadUserLocations}
                  />
            {
              !isLoggedIn ? (
                <Login></Login>
              ) : <IntroductionModalDialog></IntroductionModalDialog>
            }
            <HStack
            padding='0.2em'
            position='fixed'
            bottom='0'
            width='25em'
            height='5em' 
            marginBottom='1%'
            hidden = {!loading || !isLoggedIn}
            alignItems={'center'}
            backgroundColor='blue.700'
            borderRadius='1em'
            boxShadow='0px 0px 10px 0px rgba(0,0,0,0.50)'
            >
            <Spinner
              margin={'1.2em'}
              thickness='5px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='lg'
            />
            <VStack>
              <Text 
                textAlign='center'
                fontSize='lg'
                color='white'
                as={'b'}
                >Loading locations from your pod</Text>
                <Text 
                textAlign='center'
                fontSize='1em'
                color='white'
                >This may take some time</Text>
            </VStack>
          </HStack>

        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;