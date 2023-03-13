import * as React from "react";

import { LoginButton, useSession } from "@inrupt/solid-ui-react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { Button ,Flex, Image,Text,ButtonGroup, Box, useRadioGroup, HStack, useRadio, Stack, Radio, RadioGroup, InputGroup, InputRightAddon, Input, InputLeftAddon} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import logo from "../../lomap_logo.png"

function Login() : JSX.Element  {

    const [podProvider, setProvider] = React.useState('https://inrupt.net/');
    
    const providerOptions = [
        { value: 'https://inrupt.net/', label: 'Inrupt' },
        { value: 'https://solidcommunity.net/', label: 'Solid Community' },
      ]

    const session = useSession();
    
      const handleSubmit = async (e: any) => {
        //TODO refactor this once the restapi implementation is working
        e.preventDefault(); //if not used, the page will reload and data will be lost
        session.login({
          redirectUrl: window.location.href, // after redirect, come to the actual page
          oidcIssuer: podProvider, // redirect to the url
          clientName: "Lo Map",
          handleRedirect(redirectUrl) {
              window.open(redirectUrl,"Pod provider login")
          },
        });

        console.log("en login" + session.session.info.isLoggedIn)
        //value of session is changed to logged in and in the app.tsx file the login view will no longer appear

        // //we forward the request to the backend to logIn there
        // axios.get("http://localhost:5000/login/login", {params:{ provider : podProvider }})
        //   .then((response) => {
        //     console.log("respuesta ------------------------")
        //     console.log(response)

        //     //use this to redirect
        //     window.location.replace(response.data)
            
            
        //     // let url = response.data
        //     // console.log(url)
        //   })
        //   .catch((error) => {
        //     console.log("error en la webapp")
        //   })
      };
    return (
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
        > 
          <Image src={logo} width='20vw'></Image>
          <Text>Select your Solid provider</Text>
          <RadioGroup onChange={ setProvider} value={podProvider}>
            <Stack direction='row'>
              {
                providerOptions.map((element,i) => {
                  return (<Radio value={element.value} >{element.label}</Radio>)
                })
              }
            </Stack>
            </RadioGroup>
            <Text>Or indicate the provider URL:</Text>
            <InputGroup size='sm' width={'79%'}>
              <InputLeftAddon children='https://' />
              <Input placeholder='mysite' />
              <InputRightAddon children='.com' />
            </InputGroup>
            <Button onClick={handleSubmit} colorScheme='blue'>Login</Button>
          
          </Flex> 
        </Flex>
    )
}
{/* <div>
        
        <Select
              label="Select your pod provider: "
              options={providerOptions}
              value={podProvider}
              onChange={handleChange}
        />
        <br></br>
        <Button  onClick={handleSubmit}>Log in</Button>
      
      <p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p>
  </div> */}
export default Login;