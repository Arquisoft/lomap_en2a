import {Stack } from '@mui/material';
import './App.css';
import Login from './components/login/Login';
import {useSession } from "@inrupt/solid-ui-react";
import { deleteLocation, createLocation } from './solid/solidManagement';
import CreateLocation from './components/locations/add/CreateLocation';



function App(): JSX.Element {

  const session = useSession();

  return (
    <Stack spacing={4}>
      <Login/>
      <CreateLocation/>
      <button onClick={() => deleteLocation(session.session.info.webId as string, "https://patrigarcia.inrupt.net/profile/card#d8068302-9df2-4e42-a531-e3d39f685f93")}>DELETE</button>
    </Stack>
  );
}

export default App;
