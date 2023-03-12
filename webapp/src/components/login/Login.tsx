import * as React from "react";

import { LoginButton, useSession } from "@inrupt/solid-ui-react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";


function Login() : JSX.Element  {

    const [podProvider, setProvider] = React.useState('https://inrupt.net/');
    
    const providerOptions = [
        { value: 'https://solidcommunity.net/', label: 'Solid Community' },
        { value: 'https://inrupt.net/', label: 'Inrupt' }
      ]

    const session = useSession();


    const handleChange = (event) => {
        setProvider(event.target.value);
      };

    
      const handleSubmit = async (e) => {
        //TODO refactor this once the restapi implementation is working
        e.preventDefault(); //if not used, the page will reload and data will be lost
        session.login({
          redirectUrl: window.location.href, // after redirect, come to the actual page
          oidcIssuer: podProvider, // redirect to the url
          clientName: "Lo Map",
        });
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
          
          <p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p>
      </div>
    )
}

export default Login;