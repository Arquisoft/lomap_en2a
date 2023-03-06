import React, { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {Coordinates} from "../../../restapi/locations/Location"

type MapProps = {
  center: Coordinates;
}

const Map = ( props : MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCIuz5w6NV5uWim0rQ3lwtDRjkmj6-s-70"
  })

  const center = {
    lat:  43.37776784391247, 
    lng: -5.874621861782328
  };
  

  const [map, setMap] = React.useState(null)

  const onUnmount = React.useCallback(function callback(map) { 
    setMap(null)
  }, [])

  return (
      isLoaded?(
    // <Box width={'full'} height={'full'}>
      <GoogleMap
      mapContainerStyle={{width: '100%', height: '100%'}}
        center = {{lat: props.center.lat.valueOf(), lng: props.center.lng.valueOf()}}
        zoom = {11}
        onLoad= {()=>{}}
        onUnmount= {onUnmount}
      >

      </GoogleMap>
    // </Box>
    )
    :
    <Box>
      <h1>An error occurred while loading the map</h1>
    </Box>
  )
}

export default Map
