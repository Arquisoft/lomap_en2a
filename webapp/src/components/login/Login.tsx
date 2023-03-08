import * as React from "react";
import {login} from "@inrupt/solid-client-authn-browser"
import { LoginButton, useSession } from "@inrupt/solid-ui-react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";
import { Button, Flex } from "@chakra-ui/react";

function Login() : JSX.Element  {

    const session = useSession();

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
    
    const handleSubmit = (e) => {
        e.preventDefault(); //if not used, the page will reload and data will be lost
        session.login({
          redirectUrl: window.location.href, // after redirect, come to the actual page
          oidcIssuer: podProvider, // redirect to the url
          clientName: "Lo Map",
        });
    }

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
          <form onSubmit={handleSubmit} style={{"margin":"auto", "paddingTop":"50px"}}>
            <Select
                  label="Select your pod provider: "
                  options={providerOptions}
                  value={podProvider}
                  onChange={handleChange}
            />
            <br></br>
            <Button style={{"display":"block", "margin":"10px auto"}} type="submit">Log in</Button>
          </form>
          <p style={{"marginBottom":"15px"}}>Your webId is: {session.session.info.webId}</p>
        </Flex>
    )
}

export default Login;