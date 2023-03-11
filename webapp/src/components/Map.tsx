import { Box, useDisclosure } from "@chakra-ui/react";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { LocationView } from './LocationInfo';
import React, { useEffect, useState } from 'react'
import {Coordinates, Location} from "../../../restapi/locations/Location"
import axios from 'axios';

let pl1 : Location = {
  name: "Estatua de la libertad",
  coordinates: {
    lng: -74.044502,
    lat: 40.689249
  },
  description: "La Libertad iluminando el mundo (en inglés: Liberty Enlightening the World; en francés: La Liberté éclairant le monde), más conocida como la Estatua de la Libertad, es uno de los monumentos más famosos de Nueva York, de los Estados Unidos y de todo el mundo. Se encuentra en la isla de la Libertad al sur de la isla de Manhattan, junto a la desembocadura del río Hudson y cerca de la isla Ellis. La Estatua de la Libertad fue un regalo del pueblo francés al pueblo estadounidense en 1886 para conmemorar el centenario de la Declaración de Independencia de los Estados Unidos y como un signo de amistad entre las dos naciones.",
  images : ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-TaW47nFmTjtUFZUq0rzykiK-uHz0xf48g&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIXIVZ8SPzx19XPic897rr8uaTqP5FzYgjyg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQXdfB4Qmp35_btkh7qJ62zbu67_WqMmTag&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-TaW47nFmTjtUFZUq0rzykiK-uHz0xf48g&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIXIVZ8SPzx19XPic897rr8uaTqP5FzYgjyg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQXdfB4Qmp35_btkh7qJ62zbu67_WqMmTag&usqp=CAU']
}

let pl2 : Location = {
  name: "Central Park",
  coordinates: {
    lng: -73.9653551,
    lat: 40.7828647
  },
  description: "Central Park es un parque urbano público situado en el distrito metropolitano de Manhattan, en la ciudad de Nueva York, Estados Unidos. El parque tiene forma rectangular y dimensiones aproximadas de 4000 x 800 m, siendo superior en tamaño a las dos naciones más pequeñas del mundo; es casi dos veces más grande que Mónaco y casi ocho veces más que la Ciudad del Vaticano.1​2​3​ Si bien, su tamaño es algo inferior a la mitad del Bosque de Bolonia en París y una quinta parte de la Casa de Campo en Madrid.4",
  images : ['https://www.civitatis.com/f/estados-unidos/nueva-york/guia/central-park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/ee/New_York_City-Manhattan-Central_Park_%28Gentry%29.jpg',
    'https://media.traveler.es/photos/61378708cfa50ebf3bf4f6d5/4:3/w_1064,h_798,c_limit/5369.jpg', 'https://www.civitatis.com/f/estados-unidos/nueva-york/guia/central-park.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/e/ee/New_York_City-Manhattan-Central_Park_%28Gentry%29.jpg',
    'https://media.traveler.es/photos/61378708cfa50ebf3bf4f6d5/4:3/w_1064,h_798,c_limit/5369.jpg']
}

const locations : Array<Location> = [
  pl1, pl2
]

type MapProps = {
  center: Coordinates;
}

const Map = ( props : MapProps) => {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyASYfjo4_435pVgG-kiB3cqaDXp-77j2O8"
  })

  const init = {
    lat: 0,
    lng: 0
  };

  const [center, setCenter] = React.useState(init)
  const [map, setMap] = React.useState(null)
  const [markedLocation, setMarkedLocation] = React.useState(pl1) // si pongo null se peta el mapa

  const { onOpen, isOpen, onClose } = useDisclosure()  // for the markers

  const onUnmount = React.useCallback(function callback(map) { 
    setMap(null)
  }, [])

  const handleMapClick = (location) => {
    setMarkedLocation(location);
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    onOpen();
  }



  return (
      isLoaded?(
      <GoogleMap
        mapContainerStyle={{width: '100%', height: '100%'}}
        center = {center}
        zoom = {11}
        onLoad= {()=>{}}
        onUnmount= {onUnmount}
        options= {{fullscreenControl: false , streetViewControl:false, mapTypeControl:false}}
        //use inside of the options the styles property and personalyce a style in https://mapstyle.withgoogle.com/
      >
        {locations.map((place, i) => (
          <Marker
            position={{lat:Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
            onClick={() => handleMapClick(place)}
          ></Marker>
        ))}
        <LocationView isOpen={isOpen} onClose={onClose} place={markedLocation}></LocationView>
      </GoogleMap>
    )
    :
    <Box>
      <h1>An error occurred while loading the map</h1>
    </Box>
  )
}

export default Map
