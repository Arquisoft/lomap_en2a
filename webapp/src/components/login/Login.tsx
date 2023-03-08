import * as React from "react";
import { Button, Flex } from "@chakra-ui/react";
import axios from "axios";

function Login() : JSX.Element  {

    const [podProvider, setProvider] = React.useState('https://inrupt.net/');
    
    const providerOptions = [
        { value: 'https://solidcommunity.net/', label: 'Solid Community' },
        { value: 'https://inrupt.net/', label: 'Inrupt' }
      ]

    const authOptions = {
        clientName: "Solid Todo App",
      };

    const handleChange = (event) => {
        setProvider(event.target.value);
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
        <Flex direction="column" justifyContent="center" alignItems="center">
          <form  >
            <Select
                  label="Select your pod provider: "
                  options={providerOptions}
                  value={podProvider}
                  onChange={handleChange}
            />
            <br></br>
            <Button onClick={
              (e) => {
                e.preventDefault(); //if not used, the page will reload and data will be lost
                
                // we send to the restapi the request to add the location
                axios.post( "http://localhost:5000/login/login", 
                        //we send the webid in the session and the location to the restapi
                        {podProvider : podProvider},
                        //we indicate that the content is in json format
                        {headers: {'Content-Type' : 'application/json'}}
                    ).catch((error) =>{
                        //if the request was not correct    
                        //TODO show an error to the user so he/she can retry
                    });
        
                //TODO refactoring
                // session.login({
                //   redirectUrl: window.location.href, // after redirect, come to the actual page
                //   oidcIssuer: podProvider, // redirect to the url
                //   clientName: "Lo Map",
                // });
            }
            }>Log in</Button>
          </form>
        </Flex>
    )
              //TODO delete
          //<p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p>
}

export default Login;