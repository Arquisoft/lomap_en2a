import * as React from "react";
import './Login.css';
import { useSession } from "@inrupt/solid-ui-react";
import { Button, Flex, Input, InputGroup, Radio, RadioGroup, Stack, Image, Text } from "@chakra-ui/react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login } from "@inrupt/solid-client-authn-browser";
import lomap_logo from "../../lomap_logo.png";
import {useState } from "react";

function Login() : JSX.Element  {

  const session = useSession();

  const [userChoice, setuserChoice] = useState('https://inrupt.net/%27');
  const [customSelected, setcustomSelected] = useState(false)
  
  const providerOptions = [
      { value: 'https://solidcommunity.net/', label: 'Solid Community' },
      { value: 'https://inrupt.net/', label: 'Inrupt' },
      { value: String({userChoice}), label : 'Custom provider'}
  ]
  
  const handleSubmit = async (e) => {
    e.preventDefault(); //if not used, the page will reload and data will be lost
    login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: userChoice, // redirect to the url
      clientName: "Lo Map",
    });
  };

  return (
      (!(session as SessionInfo).session.info.isLoggedIn) ? (
        <Flex className={'backgroundAlphaColor'}>
          <Flex className={'loginPopup'} px={2}>
            <Image src={lomap_logo} width='20vw'></Image>

            <Text fontSize={'2xl'}>
                Select your Solid pod provider:
            </Text>

            <RadioGroup onChange={setuserChoice} value={userChoice} >
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

            <InputGroup  visibility={(customSelected)?"visible":"hidden"} size='sm' width={'80%'}>
              <Input placeholder='URL of custom pod provider' onChange ={(e)=>setuserChoice(e.target.value.toString())} onBlur={(e)=>e.target.value = ''}/>
            </InputGroup>

            <Button onClick={handleSubmit} colorScheme='blue' padding={'1.5vw'} marginTop='auto'>Login</Button>
          </Flex> 
        </Flex>
      ) : <></>
  )
}

export default Login;