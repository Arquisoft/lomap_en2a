import React from 'react'
import { Box, Button, ChakraProvider, Checkbox, CheckboxGroup, Flex, HStack, Input, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Tag, TagLabel } from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import  LocationInfo  from './LocationInfo';
import { Location } from "../../../restapi/locations/Location"
import AddLocationForm from './AddLocationForm';
import { Category, isLocationOfCategory } from './Category';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';


type MapProps = {
    //center: Coordinates;
    locations : Array<Location>
    changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations : () => Promise<void>
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
  const [areCheckedFilters, setCheckedFilters] = React.useState<boolean>(false) // check if there are any filters checked, if not show all locations
  const [filteredLocations, setFilteredLocations] = React.useState<Array<Location>>([]) //need constant for the filter to work

  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handlePlaceClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    //we display the info tab in the left part of the window
    props.changeViewTo(<LocationInfo location={location} loadLocations={props.loadLocations}></LocationInfo>);
  }

  function handleMapClick(lat:any,lon:any):void {
    // get coordinates where clicked
    let clickedCoords = lat + ", " + lon;

    props.changeViewTo(<></>);
    props.changeViewTo(<AddLocationForm loadLocations={props.loadLocations} clickedCoords={clickedCoords}/>);
  }

  const categories = Object.values(Category); // array of strings containing the values of the categories

  // only filtering by one category. cannot filter by multiple at once (possible but not urgent enhancement)
  const handleFilter = (e) => {
    setCheckedFilters(true) // variable to know if we have to display all the locations or filter
    let filtered: Array<Location> = [];
    for (let location of props.locations){
      let condition = isLocationOfCategory(location, e.target.value)
      if (condition) {
        filtered.push(location)
      }
    }
    setFilteredLocations(filtered) // update value of const
  }


  if (isLoaded)
    return (
      <ChakraProvider>
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
          <HStack
            direction={'column'}
            alignContent={'left'}
            marginLeft='38vw'
            overflowX='scroll'
            marginRight='5'>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} colorScheme='blue' minWidth='120px'>Friend Filter</MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup type='checkbox'>
                    {
                      categories.map((filter) => { // change it for the friends, put categories to have something to show
                        return (
                          <MenuItemOption value={filter}>{filter}</MenuItemOption>
                        )
                      })
                    }
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
              <HStack height={20} width={200}>
              {
                categories.map((filter) => { // create as many buttons as categories to filter
                  return (
                    <Button
                      borderRadius={25}
                      value={filter}
                      minWidth={90}
                      bgColor={'blue.100'}
                      onClick={(e) => handleFilter(e)}
                      >
                      {filter}
                    </Button>
                  )
                })
              }
                <Button minWidth={100}
                  onClick={(e) => setCheckedFilters(false)}
                  >Clear Filters
                </Button>
              </HStack>
          </HStack>
          {
            !areCheckedFilters? // if no filter was pressed or clean filters button was clicked, this value is false
            (props.locations.map((place, i) => (
              <Marker
                  position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                  onClick={() => handlePlaceClick(place)}
              ></Marker>)))
            :
            (
              filteredLocations.map((place, i) => ( // necessary to use a const, if not it does not work (dont know why)
                <Marker
                    position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                    onClick={() => handlePlaceClick(place)}
                ></Marker>))
            )
          }
        </GoogleMap>
      </ChakraProvider>
    );

  return (
      <Box>
        <h1>An error occurred while loading the map</h1>
      </Box>
  );
}


export default Map;