// External imports
import React, { useState, useEffect } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { ChakraProvider, Flex } from '@chakra-ui/react';

// Our imports
import './App.css';
import { Location } from '../../restapi/locations/Location';
import Login from './components/login/Login';
import Map from './components/Map';
import {createLocation, deleteLocation, getLocations} from './solid/solidManagement'
import Menu from './components/Menu';


function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [locations, setLocations] = useState<Array<Location>>([]);
  //stores the actual view currently selected
  const [selectedView, setselectedView] = useState(<></>);
  const [addLocationSuccess, setAddLocationSuccess] = useState(false);
  const [deleteLocationSuccess, setDeleteLocationSuccess] = useState(false);

  

  const getNewLocation = (location:Location) => {
    locations.push(location);
    createLocation(session.session.info.webId as string, location);
  }

  const session = useSession();

  //we get the locations for the user and fetch them to the list
  useEffect(()=>{
    loadLocations();
  },[session.session.info.isLoggedIn]);


  async function loadLocations(){
    if(session.session.info.webId){
      let locationList = await getLocations(session.session.info.webId)
      setLocations(locationList);
      setselectedView(<></>);
    }
  }

  function deleteLoc( location:Location){
    if(session.session.info.webId && location.url)
      deleteLocation(session.session.info.webId ,location.url.toString()).then(
        ()=> {
          loadLocations();
        }
      )

  }


  async function addLocation(location:Location):Promise<void>{
    if(session.session.info.webId)
      createLocation(session.session.info.webId ,location).then(
        ()=> {
          loadLocations().then(()=>{setAddLocationSuccess(true);});
        }
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
              addLocation={addLocation}
              locations={locations}
              changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
              addingSuccess={addLocationSuccess}

              />
            {
              selectedView ?  selectedView  :  <></>
            }
            <Menu deleteLocation={deleteLoc}
                  addLocation={addLocation}
                  changeViewTo= {(newView : JSX.Element) => {setselectedView(newView)}}
                  locations = {locations}
                  session = {session}
                  addingSuccess={addLocationSuccess}
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