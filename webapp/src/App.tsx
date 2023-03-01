import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Welcome from './components/Welcome';

import Map from './components/Map';

import './App.css';

function App(): JSX.Element {

  return (
    <>
      <Container maxWidth="sm">
        <Welcome message="ASW students"/>
        <Map></Map>
      </Container>
    </>
  );
}

export default App;
