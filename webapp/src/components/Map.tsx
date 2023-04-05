import React from 'react'
import { Box } from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import  LocationInfo  from './LocationInfo';
import { Location } from "../../../restapi/locations/Location"
import AddLocationForm from './AddLocationForm';


type MapProps = {
    //center: Coordinates;
    locations : Array<Location>
    changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
    deleteLocation : (loc : Location) => void
    addLocation : (location:Location) => Promise<void>
    addingSuccess: boolean
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

  const handlePlaceClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    //we display the info tab in the left part of the window
    props.changeViewTo(<LocationInfo location={location} deleteLocation={props.deleteLocation}></LocationInfo>);
  }

  function handleMapClick(lat:any,lon:any):void {
    // get coordinates where clicked
    let clickedCoords = lat + ", " + lon;

    props.changeViewTo(<></>);
    props.changeViewTo(<AddLocationForm addLocation={props.addLocation} clickedCoords={clickedCoords} addingSuccess={props.addingSuccess}/>);
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

            onClick= { (clickedCoords) => {
              let lat = clickedCoords.latLng?.lat();
              console.log("lat = ",lat);

              let lon = clickedCoords.latLng?.lng();
              console.log("lon = ",lon);

              handleMapClick(lat,lon);
            }}
            //use inside of the options the styles property and personalyce a style in https://mapstyle.withgoogle.com/
        >
          {
          /* place the locations in the map */
          props.locations.map((place, i) => (
              <Marker
                  position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                  onClick={() => handlePlaceClick(place)}
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


export default Map;