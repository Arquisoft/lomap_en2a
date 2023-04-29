import React from 'react'
import { render } from "@testing-library/react";
import ListOfLocations from "../components/locations/ListOfLocations";


//TESTED 100%

const testLocations = [
    {
      "url": "https://www.nycgo.com/attractions/the-metropolitan-museum-of-art/",
      "name": "The Metropolitan Museum of Art",
      "coordinates": {
        "lng": -73.9632,
        "lat": 40.7794
      },
      "category":[],
      "description": "One of the world's largest and finest art museums, located in New York City.",
      "images": [
        "https://www.metmuseum.org/-/media/images/visit/met-fifth-ave/met-5thave-exterior2-1024x640.jpg",
        "https://www.metmuseum.org/-/media/images/about-the-met/mission-history/history/european-paintings/gallery-paintings/19800116_picasso_lg.jpg"
      ]
    },
    {
      "url": "https://www.nps.gov/grca/index.htm",
      "name": "Grand Canyon National Park",
      "category":[],
      "coordinates": {
        "lng": -112.1121,
        "lat": 36.1069
      },
      "description": "One of the most visited national parks in the United States, known for its awe-inspiring views of the Grand Canyon.",
      "images": [
        "https://www.nps.gov/grca/planyourvisit/images/Grand-Canyon-view-wilderness-river-sunset_1.jpg",
        "https://www.nps.gov/grca/planyourvisit/images/Grand-Canyon-view-wilderness-river-sunset_2.jpg"
      ]
    },
    {
      "url": "https://www.disneyland.com/",
      "name": "Disneyland Park",
      "category":[],
      "coordinates": {
        "lng": -117.9189,
        "lat": 33.8121
      },
      "description": "One of the most iconic theme parks in the world, located in Anaheim, California.",
      "images": [
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1280/720/75/dam/disneyland/home/destination/dlr_Hero_destination_full_767x431.jpg?1594128734436",
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1280/720/75/dam/disneyland/home/destination/dlr_Hero_attractions_full_767x431.jpg?1594133181294"
      ]
    },
    {
      "url": "https://www.nps.gov/yell/index.htm",
      "name": "Yellowstone National Park",
      "category":[],
      "coordinates": {
        "lng": -110.7002,
        "lat": 44.4279
      },
      "description": "The first national park in the world, known for its geothermal features and wildlife.",
      "images": [
        "https://www.nps.gov/common/uploads/structured_data/3C86EB6B-1DD8-B71B-0BE6E0A7A8E1CE22.jpg",
        "https://www.nps.gov/common/uploads/structured_data/3C86EB6B-1DD8-B71B-0BE27D9B72829723.jpg"
      ]
    }];

//we check that when passing the own locations are loading the screen shows the loading message
test('check that when own locations loading it shows loading',async () => {
    const {getByText}= render(
      <ListOfLocations 
        setSelectedLocation={jest.fn()}
        loadLocations={jest.fn()}
        loadingOwnLocations={true}
        loadingFriendLocations={false}
        ownLocations={[]}
        friendLocations={[]}
        setSelectedView={()=>{}}></ListOfLocations>)
    expect(getByText("Loading your locations")).toBeInTheDocument();
})

//we check that when passing the friend locations are loading the screen shows the loading message
test('check that when friends locations loading it shows loading',async () => {
  const {getByText,getByTestId}= render(
    <ListOfLocations 
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={true}
      loadingFriendLocations={true}
      ownLocations={[]}
      friendLocations={[]}
      setSelectedView={()=>{}}></ListOfLocations>)
  //we click on the friendLocationsTab
  getByTestId("friendLocationsTab").click();
  expect(getByText("Loading your friends locations")).toBeInTheDocument();
})

//check that when no own locations the message to add locations is shown
test('check that when no own locations the message to add locations is shown',async () => {
  const {getByText}= render(
    <ListOfLocations
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={false}
      loadingFriendLocations={false}
      ownLocations={[]}
      friendLocations={testLocations}
      setSelectedView={()=>{}}></ListOfLocations>)
  expect(getByText("Ups")).toBeInTheDocument();
})

//check that when no own locations the message to add locations is shown
test('check that when no friends locations the message to add friends and share locations appears',async () => {
  const {getByText,getByTestId}= render(
    <ListOfLocations
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={false}
      loadingFriendLocations={false}
      ownLocations={testLocations}
      friendLocations={[]}
      setSelectedView={()=>{}}></ListOfLocations>)
    //we click on the friendLocationsTab
  getByTestId("friendLocationsTab").click();
  expect(getByText("Ups")).toBeVisible();
})

//test that with a list of own locations the list is rendered properly
test('check that the own location list renders propertly',async () => {
  const {getByText}= render(
    <ListOfLocations
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={false}
      loadingFriendLocations={false}
      ownLocations={testLocations}
      friendLocations={[]}
      setSelectedView={()=>{}}></ListOfLocations>)
  testLocations.forEach(location => {
    let name = location.name;
    expect(getByText(name)).toBeInTheDocument();
  });
})

//test that with a list of own locations the list is rendered properly
test('check that the friend location list renders propertly',async () => {
  const {getByText,getByTestId}= render(
    <ListOfLocations
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={false}
      loadingFriendLocations={false}
      ownLocations={[]}
      friendLocations={testLocations}
      setSelectedView={()=>{}}></ListOfLocations>)
  //we click on the friendLocationsTab
  getByTestId("friendLocationsTab").click();
  testLocations.forEach(location => {
    let name = location.name;
    expect(getByText(name)).toBeInTheDocument();
  });
})

//test when pressing the close button the setSelectedView function is called
test('check that when pressing the close button the setSelectedView function is called',async () => {
  const setSelectedView = jest.fn();
  const {getByTestId}= render(
    <ListOfLocations
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      loadingOwnLocations={false}
      loadingFriendLocations={false}
      ownLocations={[]}
      friendLocations={testLocations}
      setSelectedView={setSelectedView}></ListOfLocations>)
  //we click on the friendLocationsTab
  getByTestId("closeButton").click();
  expect(setSelectedView).toHaveBeenCalled();
})