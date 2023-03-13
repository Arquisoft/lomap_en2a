
import React, { useState, useEffect } from 'react';
import {  Button, ChakraProvider, Image, Input, InputGroup, Radio, RadioGroup, Stack, Text, useToast } from '@chakra-ui/react';
import {Flex} from "@chakra-ui/react";
import { Location } from '../../restapi/locations/Location';
import Map from './components/Map';
import './App.css';
import List from './components/List';
import axios  from 'axios';
import Login from './components/login/Login';
import {getLocations} from './solid/solidManagement'


import Menu from './components/Menu';
import { useSession } from '@inrupt/solid-ui-react';
import { ProfileView } from './components/ProfileInfo';
import lomap_logo from "./lomap_logo.png"

import Friends from './components/Friends';

function App(): JSX.Element {
  const [coordinates, setCoordinates] = useState({lng:0, lat:0});
  const [isLoading, setIsLoading] = useState(true)
  const [locations, setLocations] = useState<Array<Location>>([]);
  const [selectedView, setselectedView] = useState<string>("none")
  const [userChoice, setuserChoice] = useState('https://inrupt.net/')
  const [customSelected, setcustomSelected] = useState(false)

  const providerOptions = [ //last one must be the custom one, they are auto generated
      { value: 'https://inrupt.net/', label: 'Inrupt.net' },
      { value: 'https://solidcommunity.net/', label: 'Solid Community' },
      { value: String({userChoice}), label : 'Custom provider'}
    ]

  const session = useSession();
  const toast = useToast();

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
    console.log(session)
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

  const handleSubmit =  (event)=> {
    //we validate not empty url
    event.preventDefault();

    if(userChoice.trim().length == 0){
      toast({ //we show an error
        title:'Choose a valid pod provider',
        status: 'error',
        isClosable : true,
        duration : 3000
      })
      return
    }
    
    session.login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: userChoice, // redirect to the url
      clientName: "Lo Map",
    });
  }

  //here is where we have to insert the different views that the menu will triger,
  //see the onclick method on the menu.tsx buttons on how to modify this dictionary to include the 
  //rest of the views
  const views: { [id: string]: JSX.Element; } = {
    "none" : <></>,
    "list": <List places={locations} isLoading= {isLoading} />,
    "friends": <Friends webId={session.session.info.webId} session={session}/>,
    "profile" : <ProfileView webId={session.session.info.webId}></ProfileView>
 }; 

  //previous way of deleting 
  //<button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
  //TODO delet this one implemented the correct deletion

  const handleLogin= () => {
    return (
      !session.session.info.isLoggedIn ? (
    <Flex
        flexDirection={'column'}
        width={'100vw'}
        height='100vh'
        zIndex={'2'}
        position='absolute'
        justifyContent={'center'}
        alignItems='center'
        bg={'whiteAlpha.600'}>

        <Flex
          direction={'column'}
          bg={'white'}
          width={"40vw"}
          height={"40vh"}
          position={'relative'} 
          zIndex={1}
          overflow='hidden'
          px={2}
          alignItems='center'
          borderRadius={'2vh'}
          padding='1vh'
          rowGap={'1vh'}
          justifyContent='space-evenly'
> 
          <Image src={lomap_logo} width='20vw'></Image>
          <Text fontSize={'2xl'}>Select your Solid pod provider:</Text>
          <RadioGroup onChange={setuserChoice} value={userChoice}>
            <Stack direction='row'>
              {
                providerOptions.map((element,i) => {
                  if(i < providerOptions.length - 1) 
                    return (<Radio value={element.value}  onChange={(e)=>{setcustomSelected(false)}}>{element.label}</Radio>)
                  else //Last one is the custom one and should trigger the textBox
                    return (<Radio 
                              value={element.value} 
                              onChange={(e)=>{setcustomSelected(true)}}
                              >
                                {element.label}</Radio>)
                })
              }
            </Stack>
          </RadioGroup>
          <InputGroup  visibility={(customSelected)?"visible":"hidden"} size='sm' width={'80%'} >
            <Input placeholder='URL of custom pod provider' onChange ={(e)=>setuserChoice(e.target.value.toString())} onBlur={(e)=>e.target.value = ''}/>
          </InputGroup>
          <Text>{session.session.info.isLoggedIn ? 'SI' : 'N0'}</Text>
          <Button onClick={handleSubmit} colorScheme='blue' padding={'1.5vw'} marginTop='auto'>Login</Button>
          </Flex> 
        </Flex>
      ) : <></>
    )
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
            {/* <List places={locations} isLoading= {isLoading} /> */}
            <Map center = {coordinates} locations={locations}/>
            {
              selectedView ? 
              views[selectedView]
              :
              <></>
            }
            <Menu changeViewTo= {(newView : string) => {setselectedView(newView)}}/>
            {/* {handleLogin()} */}
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
