import { Button, Stack } from '@mui/material';
import './App.css';
import Login from './components/login/Login';
import {useSession } from "@inrupt/solid-ui-react";
import { deleteLocation, createLocation } from './solid/solidManagement';
import { Location } from './types/types';



function App(): JSX.Element {

  const session = useSession();

  const dummy : Location = {
    name: 'PARA BORRAR',
    latitude: '1234',
    longitude: '1234',
    description: 'ESTO ES PARA BORRAR'
  }

  return (
    <Stack>
      <Login/>
      <button onClick={() => createLocation(session.session.info.webId as string, dummy)}>CREATE</button>
      <button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
    </Stack>
  );
}

export default App;
