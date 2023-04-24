import React, { useState } from 'react'
import { Box, Button, ChakraProvider, Checkbox, useCheckboxGroup, Text,
  Flex, HStack, Popover, CheckboxGroup, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup} from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import LocationInfo from '../locations/LocationInfo';
import AddLocationForm from '../locations/AddLocationForm';
import { Category, isLocationOfCategory } from '../Category';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import { useSession } from '@inrupt/solid-ui-react';
import { getSolidFriends, getFriendsID } from "../../solid/solidManagement";
import type { Friend, Location } from "../../types/types"



type MapProps = {
    locations : Array<Location>
    changeViewTo: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations : () => Promise<void>
    loadUserLocations: ()=> Promise<void>
}

const blueIcon = 'http://maps.google.com/mapfiles/ms/icons/blue.png';
const redIcon = 'http://maps.google.com/mapfiles/ms/icons/red.png';

const Map = ( props : MapProps) => {
  const session = useSession();
  const { isLoaded } = useJsApiLoader({ 
    id: 'google-map-script',
        //we get the google maps api key from the enviroment variables
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string
      })

  const init = {
    lat: 43.37776784391247,
    lng: -5.874621861782328
  };

  const [center, setCenter] = React.useState(init)
  const [map, setMap] = React.useState(null)
  const [areCheckedFilters, setAreCheckedFilters] = React.useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] = React.useState<Array<Location>>([]) //need constant for the filter to work
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [checkedCategory, setCheckedCategory] = React.useState("");
  const [checkedFriends, setCheckedFriends] = React.useState<string[]>([]);
  const [friendChargingMsg, setFriendChargingMsg] = React.useState("Loading friends... ")

  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handlePlaceClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat,
      lng: location.coordinates.lng
    }
    setCenter(newCenter)
    
    props.changeViewTo(<LocationInfo setSelectedView={(view) =>props.changeViewTo(view)} location={location} loadLocations={props.loadLocations}></LocationInfo>);
  }

  function handleMapClick(lat:any,lon:any):void {
    // get coordinates where clicked
    let clickedCoords = lat + ", " + lon;

    props.changeViewTo(<></>);
    props.changeViewTo(<AddLocationForm setSelectedView={(view)=> props.changeViewTo(view)} loadLocations={props.loadLocations} clickedCoords={clickedCoords} loadUserLocations={props.loadUserLocations}/>);
  }

  const colors = ['teal', 'purple', 'pink', 'blue', 'green', 'orange'];
  const categories = Object.values(Category); // array of strings containing the values of the categories


  const handleFriends = async () => {
    if (session.session.info.webId !== undefined && session.session.info.webId !== ""){
      const n  = await getSolidFriends(session.session.info.webId);
      if (n.length === 0)
        setFriendChargingMsg("Add friends to see their locations!")
      setFriends(n);
    }
    else{
      setFriends([]);
    }
  }

  const handleFilter = () => {
    const filtered = props.locations.filter(location => {
      const locationCreator = `${(location.url as string).split("private")[0]}profile/card#me`;
      const categoryToFilter = (checkedCategory == "") ? true : isLocationOfCategory(location, checkedCategory);
      const friendsToFilter = (checkedFriends.length == 0) ? true : checkedFriends.includes(locationCreator);
      return categoryToFilter && friendsToFilter;
    });
    setFilteredLocations(filtered);
  };
  
  // execute handleFilter() once the category has been updated
  React.useEffect(() => {
    handleFilter()
  }, [checkedCategory]);

  // handle clicks on the category filter buttons
  const handleCategoryClick = (e) => {
      setAreCheckedFilters(true);
      setCheckedCategory(e.target.value);
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
              let lon = clickedCoords.latLng?.lng();
              handleMapClick(lat,lon);
            }}
            //use inside of the options the styles property and personalyce a style in https://mapstyle.withgoogle.com/
        >
          <HStack
            direction={'column'}
            alignContent={'left'}
            marginLeft='40%'
            overflowX='scroll'
            marginEnd='2%'
            marginTop='2%'>
              <Menu closeOnSelect={false}>
                <MenuButton onClick={async () => await handleFriends()} as={Button} colorScheme='blue' minWidth='10%'>Friend Filter</MenuButton>
                <MenuList minWidth='20%'>
                  {
                    friends.length > 0 ? 
                    <MenuOptionGroup type='checkbox' value={checkedFriends}>
                    {
                      friends.map((friend) => {
                        return (
                          <MenuItemOption value={friend.webID as string}
                              onClick={(e:any) =>{ 
                                // check if it is being selected or unselected
                                let index = checkedFriends.indexOf(e.target.value);
                                (index == -1)? checkedFriends.push(e.target.value) : 
                                  checkedFriends.splice(index, 1);
                                handleFilter()
                                setAreCheckedFilters(checkedFriends.length != 0 || checkedCategory != "") }}>
                            {friend.webID as string}</MenuItemOption>
                        )
                      })
                    }
                  </MenuOptionGroup> 
                    :
                    <Text>{friendChargingMsg}</Text>
                  }
                </MenuList>
              </Menu>
              <HStack>
              {
                categories.map((filter, index) => { // create as many buttons as categories to filter
                  return (
                    <Button
                      key={index}
                      borderRadius={25}
                      value={filter}
                      minWidth={'15%'}
                      onClick={(e:any) => handleCategoryClick(e)}
                      bgColor={`${colors[index % colors.length]}.50`}
                      >
                      {filter}
                    </Button>
                  )
                })
              }
                <Button minWidth={'19%'}
                  onClick={(e) => {
                    setCheckedCategory("")
                    setCheckedFriends([]);
                    setAreCheckedFilters(false);
                  }}
                  >Clear Filters
                </Button>
              </HStack>
          </HStack>
          {
            !areCheckedFilters? 
            (
              // if no filters are checked, use the global locations
              props.locations.map((place, i) => (
              <Marker
                  key={i}
                  position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                  onClick={() => handlePlaceClick(place)}
                  icon={
                    place.isFriend
                      ? blueIcon
                      : redIcon
                  }
              ></Marker>))
            )
            :
            (
              filteredLocations.map((place, i) => (
              <Marker
                  position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                  onClick={() => handlePlaceClick(place)}
                  icon={
                    place.isFriend
                      ? blueIcon
                      : redIcon
                  }
              ></Marker>))
            )
          }
        </GoogleMap>
      </ChakraProvider>
    );

  return (
      <Box>
        <h1>Loading the map...</h1>
      </Box>
  );
}


export default Map;