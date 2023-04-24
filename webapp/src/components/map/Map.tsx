import React, { useState } from 'react'
import { Box, Button, ChakraProvider, VStack, Icon, Text,
  Flex, HStack, Popover, CheckboxGroup, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup} from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import LocationInfo from '../locations/LocationInfo';
import AddLocationForm from '../locations/AddLocationForm';
import { Category, isLocationOfCategory } from '../Category';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import { useSession } from '@inrupt/solid-ui-react';
import { getSolidFriends } from "../../solid/solidManagement";
import type { Friend, Location } from "../../types/types"
import {MdAddLocationAlt} from "react-icons/md";
import {TbMap2} from "react-icons/tb";


type MapProps = {
    locations : Array<Location>
    changeViewTo: (viewName: string) => void //function to change the selected view on the left
    loadLocations : () => Promise<void>
    setClickedCoordinates : (coordinates: string) => void
    clickedCoordinates : string
    selectedView : string
}

const Map = ( props : MapProps) => {
  const session = useSession();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string
  })

  const init = { //TODO fix this to be the user location
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
  //this state indicates if the user is in LOCATION CREATION MODE
  const [inLocationCreationMode, setInLocationCreationMode] = React.useState<boolean>(false);

  function locationCreationModeButton(){
    //we define as the return type the button (circle sized) that will be placed at the botton right corner of the map
    //and that will have the icon MdAddLocationAlt from react-icons. The button will be red and the icon will be white
    //once clicked it will toggle the state inLocationCreationMode
    return(
      <Button
        size="lg"
        borderRadius="50%"
        width="4.5em"
        height="4.5em"
        position="absolute"
        bottom="2em"
        right="4em"
        colorScheme={inLocationCreationMode? "red" :  "blue"}
        onClick={() => setInLocationCreationMode(!inLocationCreationMode)}
      >
        <MdAddLocationAlt  size="4.5em" color={inLocationCreationMode?"black" : "white"}/> 
      </Button>
    ) 
  }

  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handlePlaceClick = (location) => {
    const newCenter = {
      lat: location.coordinates.lat as number,
      lng: location.coordinates.lng as number
    }
    
    setCenter(newCenter)
    
    props.changeViewTo('LocationInfo');
  }

  function handleMapClick(lat:any,lon:any):void {
    // get coordinates where clicked
    let clickedCoords = lat + ", " + lon;

    //we update the currently clicked coordinates
    props.setClickedCoordinates(clickedCoords);

    //if the currently selected view is not the add location form, we change it to it
    if (props.selectedView !== 'AddLocationForm'){
      props.changeViewTo('AddLocationForm');
    }
  }

  const colors = ['teal', 'purple', 'pink', 'blue', 'green', 'orange'];
  const categories = Object.values(Category); // array of strings containing the values of the categories


  const handleFriends = async () => {
    if (session.session.info.webId !== undefined && session.session.info.webId !== ""){
      const n  = await getSolidFriends(session.session.info.webId);
      if (n.length == 0)
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
  //when the addLocationMode is activated the cursor will be the MdAddLocationAlt icon
    return (
      <ChakraProvider>
        <Box
          width = '100%'
          height = '100%'
          cursor= "url('https://maps.google.com/mapfiles/ms/icons/red-dot.png'), auto">
          <GoogleMap 
              mapContainerStyle={{width: '100%', height: '100%'}}
              center={center}
              zoom={10}
              onLoad={() => {}}
              onUnmount={onUnmount}
              options={{
                fullscreenControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                minZoom: 3,
                restriction: {
                  latLngBounds: {
                    north: 85,
                    south: -85,
                    west: -180,
                    east: 180,
                  }
                },
              }}
              onClick= { (clickedCoords) => {
                //we check if the user is in location creation mode
                if(inLocationCreationMode){
                  let lat = clickedCoords.latLng?.lat();
                  let lon = clickedCoords.latLng?.lng();
                  //we disable the location creation mode
                  setInLocationCreationMode(false);
                  handleMapClick(lat,lon);
                }
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
                                  let index = checkedFriends.indexOf(e.target.innerText);
                                  (index == -1)? checkedFriends.push(e.target.innerText) : 
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
                ></Marker>))
              )
              :
              (
                filteredLocations.map((place, i) => (
                <Marker
                    position={{lat: Number(place.coordinates.lat), lng: Number(place.coordinates.lng)}}
                    onClick={() => handlePlaceClick(place)}
                ></Marker>))
              )
            }
          </GoogleMap>
        </Box>
        {
          locationCreationModeButton()
        }
        {
          //if the location creation mode is activated, we will show a panel at the botton indicating
          //the application is recording the next click on the map . 
          //The panel will show centered at the middle of the screen at the bottom part of it
          <VStack
            padding='0.5em'
            position='fixed'
            bottom='0'
            width='30em'
            height='7em' 
            marginBottom='1%'
            hidden = {inLocationCreationMode ? false : true}
            alignItems={'center'}
            backgroundColor='white'
            borderRadius='1em'
            boxShadow='0px 0px 10px 0px rgba(0,0,0,0.50)'
            >
            <Icon as={TbMap2} color='red.500' width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />
            <Text 
              textAlign='center'
              fontSize='lg'
              >Click on the map to register the coordinates</Text>
          </VStack>
        }
      </ChakraProvider>
    );

  return (
      <Box>
        <h1>An error occurred while loading the map</h1>
      </Box>
  );
}


export default Map;