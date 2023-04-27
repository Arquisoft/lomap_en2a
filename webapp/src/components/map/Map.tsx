import React,{useEffect} from 'react'
import { Box, Button, ChakraProvider, VStack, Icon, Text,
 HStack, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup} from "@chakra-ui/react";
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

import { Category, isLocationOfCategory } from '../Category';
import { useSession } from '@inrupt/solid-ui-react';
import { getSolidFriends, getFriendsID } from "../../solid/solidManagement";
import type { Friend, Location } from "../../types/types"
import {TbMap2} from "react-icons/tb";



type MapProps = {
    locations : Array<Location>
    changeViewTo: (viewName: string) => void //function to change the selected view on the left
    setClickedCoordinates : (coordinates: string) => void //function to change the coordinates of the location that has been clicked
    clickedCoordinates : string //coordinates of the location that has been clicked
    selectedView : string //indicates the view that is currently selected on the left
    setInLocationCreationMode : (inLocationCreationMode: boolean) => void //function to change the state of the location creation mode
    inLocationCreationMode : boolean //indicates if the user is in LOCATION CREATION MODE
    setSelectedLocation : (location: Location) => void //changes the location that has the focus
    selectedLocation : Location|null //location that has the focus
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
  const [center, setCenter] = React.useState( {lat: 43.37776784391247, lng: -5.874621861782328})
  const [map, setMap] = React.useState(null)
  const [areCheckedFilters, setAreCheckedFilters] = React.useState<boolean>(false);
  const [filteredLocations, setFilteredLocations] = React.useState<Array<Location>>([]) //need constant for the filter to work
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [checkedCategory, setCheckedCategory] = React.useState("");
  const [checkedFriends, setCheckedFriends] = React.useState<string[]>([]);
  const [friendChargingMsg, setFriendChargingMsg] = React.useState("Loading friends... ")
  //this state indicates if the user is in LOCATION CREATION MODE
  const [inLocationCreationMode, setInLocationCreationMode] = React.useState<boolean>(props.inLocationCreationMode);

  //set as center the user location
  useEffect(() => {
    // get the user's current location
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setCenter({ lat: latitude, lng: longitude });
    });
    
  }, []);

  //when the selectedLocation is changed the center of the map will be the location that has the focus
  useEffect(() => {
    //if no selected location, we do nothing
    if(props.selectedLocation === null || props.selectedLocation === undefined) return;

    const newCenter = {
      lat: props.selectedLocation.coordinates.lat.valueOf(),
      lng: props.selectedLocation.coordinates.lng.valueOf()
    }
    
    setCenter(newCenter)
  }, [props.selectedLocation])

  //we update the state of the location creation mode when the prop changes
  React.useEffect(() => {
    setInLocationCreationMode(props.inLocationCreationMode);
  }, [props.inLocationCreationMode]);

  const onUnmount = React.useCallback(function callback() {setMap(null)}, [])

  const handlePlaceClick = (location) => {
    props.setSelectedLocation(location);
    props.changeViewTo('Map');
    props.changeViewTo('LocationInfo');
  }

  function handleMapClick(lat:any,lon:any):void {

    // get coordinates where clicked
    let clickedCoords = lat + ", " + lon;

    //we update the currently clicked coordinates
    props.setClickedCoordinates(clickedCoords);
    //we update the state of the location creation mode
    props.setInLocationCreationMode(false);

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

  const mapStyles = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]


  if (isLoaded)
  //when the addLocationMode is activated the cursor will be the MdAddLocationAlt icon
    return (
      <ChakraProvider>
        <Box
          width = '100%'
          height = '100%'>
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
                styles: mapStyles
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
                        friends.map((friend,i) => {
                          return (
                            <MenuItemOption key={i} value={friend.webID as string}
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
                    title={place.name}
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
                    title={place.name}
                    icon={
                      place.isFriend
                        ? blueIcon
                        : redIcon
                    }
                ></Marker>))
              )
            }
            {
              //we place a marker on the map where the user is currently trying to add a location
              //the coordinates are the ones received as a prop called 'clickedCoordinates' with string format
              // "lat, lon" having as icon the MdAddLocationAlt icon
              props.clickedCoordinates.length > 0?
              <Marker
                position={{lat: Number(props.clickedCoordinates.split(",")[0]), lng: Number(props.clickedCoordinates.split(",")[1])}}
                icon={{
                  url:  'http://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png',
                  scaledSize: new window.google.maps.Size(40, 40),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 35)
                }}
                title={'Adding Location Here'}
                animation = {window.google.maps.Animation.DROP}
              ></Marker>
              :
              <></>
                
            }
          </GoogleMap>
        </Box>
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
        <h1>Loading the map...</h1>
      </Box>
  );
}


export default Map;