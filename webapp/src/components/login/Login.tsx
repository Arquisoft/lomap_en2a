import * as React from "react";
import { useSession } from "@inrupt/solid-ui-react";
import { Button, Flex, Input, InputGroup, Radio, RadioGroup, Stack, Image, Text } from "@chakra-ui/react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login } from "@inrupt/solid-client-authn-browser";
import lomap_logo from "../../lomap_logo.png"
import { useState } from "react";


function Login(props : any) : JSX.Element  {

  const [podProvider, setProvider] = React.useState('https://inrupt.net/');
  const [userChoice, setuserChoice] = useState('https://inrupt.net/%27');
  const [customSelected, setcustomSelected] = useState(false)
  
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
    login({
      redirectUrl: window.location.href, // after redirect, come to the actual page
      oidcIssuer: podProvider, // redirect to the url
      clientName: "Lo Map",
    });
  };


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
  )
}

export default Login;