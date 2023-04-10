import React from 'react'
import { Box, Button, ChakraProvider, Checkbox, CheckboxGroup, Flex, HStack, Input, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Tag, TagLabel } from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import  LocationInfo  from './LocationInfo';
import {Location} from "../../../restapi/locations/Location"
import { Category, isLocationOfCategory } from './Category';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import { useSession } from '@inrupt/solid-ui-react';
import { getSolidFriends } from "../solid/solidManagement";
import type { Friend } from "../../../restapi/users/User";


type MapProps = {
  locations : Array<Location>
  changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
  deleteLocation : (loc : Location) => void
}

const Map = ( props : MapProps) => {

  const session = useSession();

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
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [checkedFriends, setCheckedFriends] = React.useState<string[]>([]);


  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handleMapClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    //we display the info tab in the left part of the window
    props.changeViewTo(<LocationInfo location={location} deleteLocation={props.deleteLocation}></LocationInfo>);
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

  React.useEffect(() => {
    handleFriends()
  }, [session.session.info.isLoggedIn]);

  const handleFriends = async () => {
    if (session.session.info.webId !== undefined && session.session.info.webId !== ""){
      const n  = await getSolidFriends(session.session.info.webId);
      setFriends(n);
    }
    else{
      setFriends([]);
    }
  }

  const filteringFriends = (e) => {
    setCheckedFilters(true);
    const index = checkedFriends.indexOf(e.target.innerText); //use innerText to get the friend webID
    let filtered: Array<Location> = [];

    for (let location of props.locations){
      let creator = `${(location.url as string).split("private")[0]}profile/card#me`
      const locIndex = filteredLocations.indexOf(location)
      if (creator === e.target.innerText) {
        // if the index is > -1, means this filter was already applied
        if (index > -1) { 
          checkedFriends.splice(index, 1); // 2nd parameter means remove one item only    
          if (locIndex > -1) // the location was in the array so delete it
            filteredLocations.length>1? filteredLocations.splice(index, 1) : filtered = props.locations
        }
        // if the index was not in the checkedFriends means that the user wants to apply new filter
        else{
          checkedFriends.push(e.target.innerText as string) // add friend
          filtered.push(location)
        }
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
                      friends.map((friend) => {
                        return (
                          <MenuItemOption value={friend.webID as string} onClick={(e) => filteringFriends(e)}>
                            {friend.webID as string}</MenuItemOption>
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
                  onClick={() => handleMapClick(place)}
                  
              ></Marker>)))
            : 
            (
              filteredLocations.map((place, i) => ( // necessary to use a const, if not it does not work (dont know why)
                <Marker
                    position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                    onClick={() => handleMapClick(place)}
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


export default Map
