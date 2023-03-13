import * as React from "react";

import {login} from "@inrupt/solid-client-authn-browser"
import { Button ,Flex, Image,Text, Stack, Radio, RadioGroup, InputGroup, Input,  useToast} from "@chakra-ui/react";
import { useState } from "react";
import logo from "../../lomap_logo.png"
import {SessionInfo} from "@inrupt/solid-ui-react/dist/src/hooks/useSession"
import {useSession} from "@inrupt/solid-ui-react"

type sessionProps = {
  //s : SessionInfo
  s :  (s:SessionInfo) => void
}

function Login(props : sessionProps) : JSX.Element  {
    const [userChoice, setuserChoice] = useState('https://inrupt.net/')
    const [customSelected, setcustomSelected] = useState(false)

    const toast = useToast();
    
    const session = useSession();
    
    const providerOptions = [ //last one must be the custom one, they are auto generated
        { value: 'https://inrupt.net/', label: 'Inrupt.net' },
        { value: 'https://solidcommunity.net/', label: 'Solid Community' },
        { value: String({userChoice}), label : 'Custom provider'}
      ]
        
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

      //we pass the app component the session for it to be stored
      props.s(session)
        

        //TODO refactor this once the restapi implementation is working
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
          justifyContent='space-evenly'
        > 
          <Image src={logo} width='20vw'></Image>
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

          <Button onClick={handleSubmit} colorScheme='blue' padding={'1.5vw'} marginTop='auto'>Login</Button>
          <Button onClick={(e)=>{console.log(session.session.info)}} colorScheme='red' padding={'1.5vw'} marginTop='auto'>Cheat</Button>
          {session.session.info.isLoggedIn? <Text>Si</Text> : <Text>No</Text>}
          </Flex> 
        </Flex>
    )
}
export default Login;