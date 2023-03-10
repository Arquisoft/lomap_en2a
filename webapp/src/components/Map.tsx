import React, { useState } from 'react'
import { Box, useDisclosure } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import {Coordinates, Location} from "../../../restapi/locations/Location"
import { LocationView } from './LocationInfo';



let place : Location = {
  name: "Estatua de la libertad",
  coordinates: {
    lng: -74.044502,
    lat: 40.689249
  },
  description: "Estatua de la libertad en Estados Unidos",
  images : ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-TaW47nFmTjtUFZUq0rzykiK-uHz0xf48g&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIXIVZ8SPzx19XPic897rr8uaTqP5FzYgjyg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQXdfB4Qmp35_btkh7qJ62zbu67_WqMmTag&usqp=CAU']
}

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
  const [markedLocation, setMarkedLocation] = React.useState(place)

  const { onOpen, isOpen, onClose } = useDisclosure()  // for the markers

  const onUnmount = React.useCallback(function callback(map) { 
    setMap(null)
  }, [])

  const handleMapClick = (event) => {
    setMarkedLocation(place);
    onOpen();
  }


  return (
      isLoaded?(
    // <Box width={'full'} height={'full'}>
      <GoogleMap
        mapContainerStyle={{width: '100%', height: '100%'}}
        center = {{lat: props.center.lat.valueOf(), lng: props.center.lng.valueOf()}}
        zoom = {11}
        onLoad= {()=>{}}
        onUnmount= {onUnmount}
        onClick={handleMapClick}
      >
        {/* {props.locations.map((place, i) => (
          <Marker
            position={{lat:Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
          ></Marker>
        ))} */}
        <Marker position={{lat:40.689249, lng: -74.044502}} onClick={handleMapClick}></Marker>
        <LocationView isOpen={isOpen} onClose={onClose}></LocationView>
      </GoogleMap>
    )
    :
    <Box>
      <h1>An error occurred while loading the map</h1>
    </Box>
  )
}

// TODO: create a customized marker to store the location object
export default Map
