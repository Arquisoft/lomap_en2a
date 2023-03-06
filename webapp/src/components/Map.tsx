import React, { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import {Coordinates} from "../../../restapi/locations/Location"

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCIuz5w6NV5uWim0rQ3lwtDRjkmj6-s-70"
  })

  const center = {
    lat:  43.37776784391247, 
    lng: -5.874621861782328
  };
  

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) { 
    setMap(null)
  }, [])

  const [coordinates, setCoordinates] = useState({lat:0,lng:0});
  return (
      isLoaded?(
    // <Box width={'full'} height={'full'}>
      <GoogleMap
      mapContainerStyle={{width: '100%', height: '100%'}}
        center = {center}
        zoom = {12}
        onLoad= {onLoad}
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
