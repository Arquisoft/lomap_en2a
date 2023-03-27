import React, { useEffect, useState } from 'react'
import { Box, useDisclosure } from "@chakra-ui/react";
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from '@react-google-maps/api';
import  LocationInfo  from './LocationInfo';
import {Coordinates, Location} from "../../../restapi/locations/Location"
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';


type MapProps = {
  //center: Coordinates;
  locations : Array<Location>
  changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
  session : SessionInfo
}

const Map = ( props : MapProps) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyASYfjo4_435pVgG-kiB3cqaDXp-77j2O8"
  })

  const init = {
    lat: 43.37776784391247,
    lng: -5.874621861782328
  };

  const [center, setCenter] = React.useState(init)
  const [map, setMap] = React.useState(null)


  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handleMapClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    //we display the info tab in the left part of the window
    props.changeViewTo(<LocationInfo location session = {props.session}></LocationInfo>);
  }


  if (isLoaded)
    return (
        <GoogleMap mapContainerStyle={{width: '100%', height: '100%'}}
            center={center}
            zoom={10}
            onLoad={() => {}}
            onUnmount={onUnmount}
            options={{
              fullscreenControl: false, streetViewControl: false, mapTypeControl: false,
              minZoom: 3,
              restriction: {latLngBounds: { north: 85, south: -85, west: -180, east: 180 },}
            }}
            //use inside of the options the styles property and personalyce a style in https://mapstyle.withgoogle.com/
        >
          {
          /* place the locations in the map */
          props.locations.map((place, i) => (
              <Marker
                  position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                  onClick={() => handleMapClick(place)}
              ></Marker>
          ))}
        </GoogleMap>
    );

  return (
      <Box>
        <h1>An error occurred while loading the map</h1>
      </Box>
  );
}


export default Map
