import { Session} from "@inrupt/solid-client-authn-browser";
import AddLocation from "./components/AddLocation";
import Login from "./components/Login";
import { Location } from "./types/types";
import { createLocation } from "./solid/solidManagement"

import './App.css';
import {
  LoginButton,
  Text,
  useSession,
  CombinedDataProvider,
} from "@inrupt/solid-ui-react";
import { InputLabel } from "@mui/material";

const dummy : Location = {name: "hola", latitude: "1", longitude:"1", description:"prueba"}
let webID: string | undefined
const authOptions = {
  clientName: "Solid Todo App",
};


function App(): JSX.Element {
  
  const session = useSession();

  return (
    <div className="app-container">
        <AddLocation
          onClick={() => createLocation(session.session.info.webId as string, dummy)}
        />  
        {/* <Login onClick={() => login()}></Login> */}
        <div className="message">
          <span>You are not logged in. </span>
          <LoginButton
            oidcIssuer="https://inrupt.net/"
            redirectUrl={window.location.href}
						authOptions={authOptions}
          />
          <p>Info: {session.session.info.webId as string}</p>
        </div>
    </div>
  );
}

export default App;
