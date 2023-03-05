import * as React from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {login} from "@inrupt/solid-client-authn-browser"
import { Button, InputLabel, MenuItem, Stack } from "@mui/material";
import { LoginButton, useSession } from "@inrupt/solid-ui-react";
import { SessionInfo } from "@inrupt/solid-ui-react/dist/src/hooks/useSession";

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
                <select value={value} onChange={onChange}>
                {options.map((option) => (
                    <option value={option.value}>{option.label}</option>
                ))}
                </select>
            </label>
        );
      };

    return (
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
          <form onSubmit={handleSubmit}>
            <Select
                  label="Select your pod provider: "
                  options={providerOptions}
                  value={podProvider}
                  onChange={handleChange}
              />
              {/* <LoginButton
                oidcIssuer={podProvider}
                redirectUrl={window.location.href}
                authOptions={authOptions}
              /> */}
              <Button type="submit">Log in</Button>
            </form>
            <p>Your webId is: {session.session.info.webId}</p>
        </Stack>
    )
}

export default Login;