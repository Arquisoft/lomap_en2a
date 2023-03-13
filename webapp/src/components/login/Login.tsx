import * as React from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { Button, Flex, Input, InputGroup, Radio, RadioGroup, Stack, Image, Text } from "@chakra-ui/react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login } from "@inrupt/solid-client-authn-browser";
import lomap_logo from "../../lomap_logo.png"
import { useState } from "react";


function Login(props : any) : JSX.Element  {

  const [userChoice, setuserChoice] = useState('https://inrupt.net/%27');
  const [customSelected, setcustomSelected] = useState(false)
  
  const providerOptions = [
      { value: 'https://solidcommunity.net/', label: 'Solid Community' },
      { value: 'https://inrupt.net/', label: 'Inrupt' },
      { value: String({userChoice}), label : 'Custom provider'}
  ]
  
  const handleSubmit = async (e) => {
    //TODO refactor this once the restapi implementation is working
    e.preventDefault(); //if not used, the page will reload and data will be lost
    login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: userChoice, // redirect to the url
      clientName: "Lo Map",
    });
  };


  // const Select = ({ label, value, options, onChange }) => {
  //     return (
  //         <label> {label}
  //             <select value={value} onChange={onChange} style={{"fontSize":"0.9em"}}>
  //             {options.map((option) => (
  //                 <option value={option.value}>{option.label}</option>
  //             ))}
  //             </select>
  //         </label>
  //     );
  // };

  return (
    // <div>
    //   <Select
    //         label="Select your pod provider: "
    //         options={providerOptions}
    //         value={podProvider}
    //         onChange={handleChange}
    //   />
    //   <br></br>
    //   <Button  onClick={handleSubmit}>Log in</Button>
    
    // {/* <p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p> */}
    // </div> 
      (!props.session.info.isLoggedIn) ? (
        <Flex flexDirection={'column'} width={'100vw'} height='100vh' zIndex={'2'}position='absolute'justifyContent={'center'}alignItems='center'bg={'whiteAlpha.600'}>
          <Flex direction={'column'} bg={'white'} width={"40vw"} height={"40vh"} position={'relative'} zIndex={1} overflow='hidden' px={2} alignItems='center' borderRadius={'2vh'} padding='1vh' rowGap={'1vh'} justifyContent='space-evenly'> 
            <Image src={lomap_logo} width='20vw'></Image>
            <Text fontSize={'2xl'}>Select your Solid pod provider:</Text>
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
            <InputGroup  visibility={(customSelected)?"visible":"hidden"} size='sm' width={'80%'} >
              <Input placeholder='URL of custom pod provider' onChange ={(e)=>setuserChoice(e.target.value.toString())} onBlur={(e)=>e.target.value = ''}/>
            </InputGroup>
            <Button onClick={handleSubmit} colorScheme='blue' padding={'1.5vw'} marginTop='auto'>Login</Button>
          </Flex> 
        </Flex>
      ) : <></>
  )
}

export default Login;