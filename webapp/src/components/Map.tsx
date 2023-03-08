import React, { useState } from 'react'
import { Box } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import {Coordinates, Location} from "../../../restapi/locations/Location"


type MapProps = {
  center: Coordinates;
  locations : Array<Location>
}

const Map = ( props : MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyASYfjo4_435pVgG-kiB3cqaDXp-77j2O8"
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
      <GoogleMap
      mapContainerStyle={{width: '100%', height: '100%'}}
        center = {{lat: props.center.lat.valueOf(), lng: props.center.lng.valueOf()}}
        zoom = {11}
        onLoad= {()=>{}}
        onUnmount= {onUnmount}
        
      >
        {props.locations.map((place, i) => (
          <Marker
            position={{lat:Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
          ></Marker>
        ))}
      </GoogleMap>
    )
    :
    <Box>
      <h1>An error occurred while loading the map</h1>
    </Box>
  )
}

export default Map
