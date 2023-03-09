import * as React from "react";

import { LoginButton, useSession } from "@inrupt/solid-ui-react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { login, handleIncomingRedirect } from '@inrupt/solid-client-authn-browser';
import { Button } from "@chakra-ui/react";

function Login() : JSX.Element  {

    const [podProvider, setProvider] = React.useState('https://inrupt.net/');
    
    const providerOptions = [
        { value: 'https://solidcommunity.net/', label: 'Solid Community' },
        { value: 'https://inrupt.net/', label: 'Inrupt' }
      ]

    const { session } = useSession();


    const handleChange = (event) => {
        setProvider(event.target.value);
      };

    
      const handleSubmit = async (e) => {
        e.preventDefault()
        await login({
          oidcIssuer: podProvider,
          redirectUrl: window.location.href,
          clientName: 'LoMap',
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
          
          <p style={{"marginBottom":"15px"}}>Your webId is: {session.info.webId}</p>
      </div>
        // <Flex direction="column" justifyContent="center" alignItems="center">
        //   <form  >
        //     <Select
        //           label="Select your pod provider: "
        //           options={providerOptions}
        //           value={podProvider}
        //           onChange={handleChange}
        //     />
        //     <br></br>
            
        //   </form>
        // </Flex>
    )
              //TODO delete
          //<p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p>
}

export default Login;