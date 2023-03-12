
import React, { useState, useEffect } from 'react';
import { Button, ChakraProvider, Text, useDisclosure } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';
import './App.css';
import List from './components/List';
import axios  from 'axios';
import Login from './components/login/Login';
import CreateLocation from './components/locations/add/CreateLocation';
import { LoginButton, SessionProvider, useSession } from "@inrupt/solid-ui-react";
import { ProfileView } from './components/ProfileInfo';
import Menu from './components/Menu';
import { handleIncomingRedirect, Session } from "@inrupt/solid-client-authn-browser";
import { getNameFromPod } from './solid/solidManagement';



function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [selectedView, setselectedView] = useState<string>("none")

  const session = useSession();
 
  const [podProvider, setProvider] = React.useState('https://inrupt.net/');
  
  const providerOptions = [
      { value: 'https://solidcommunity.net/', label: 'Solid Community' },
      { value: 'https://inrupt.net/', label: 'Inrupt' }
  ]

  const handleChange = (event) => {
    setProvider(event.target.value as string);
  };
  
  const handleSubmit = async (e) => {
    //TODO refactor this once the restapi implementation is working
    e.preventDefault(); //if not used, the page will reload and data will be lost
    await session.login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: podProvider, // redirect to the url
      clientName: "Lo Map",
    });
  };

  // const saveWebId = (webId) => {
  //   webIDstore = webId;
  // }

  // const handleRedirect = async () => {
  //   await session.session.handleIncomingRedirect(window.location.href);
  //   if (session.session.info.isLoggedIn) {
  //     const dummy = session.info.webId
  //     saveWebId(dummy)
  //   }
  // }


  //get the user's current location and save it for the map to use it as a center
  useEffect(()=>{
    //handleRedirect();
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
    "list": <List places={locations} isLoading= {isLoading} />,
    "profile" : <ProfileView webId={session.session.info.webId}></ProfileView>
 }; 

  //previous way of deleting 
  //<button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
  //TODO delet this one implemented the correct deletion

  const Select = ({ label, value, options, onChange }) => {
    return (
        <label> {label}
            <select value={value} onChange={onChange} style={{"fontSize":"0.9em"}}>
            {options.map((option) => (
                <option value={option.value}>{option.label}</option>
            ))}
            </select>
        </label>
    );
  };

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
            {/* <List places={locations} isLoading= {isLoading} /> */}
            <Map center = {coordinates} /*locations={locations}*//>
            {
              selectedView ? 
              views[selectedView]
              :
              <></>
            }
            <Menu changeViewTo= {(newView : string) => {setselectedView(newView)}}/>
            <div>
              <Select
                    label="Select your pod provider: "
                    options={providerOptions}
                    value={podProvider}
                    onChange={handleChange}
              />
              <br></br>
              <Button  onClick={handleSubmit}>Log in</Button>
            
            {/* <p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p> */}
          </div>
        </Flex>
      </ChakraProvider>
    </>
   
  );
}

export default App;
