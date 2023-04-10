import * as React from 'react';
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Map from "./Map";
import { Location } from '../../../restapi/locations/Location';
import * as ReactGoogleMapsApi from "@react-google-maps/api";


const testLocations : Array<Location> = [
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
      "coordinates": {
        "lng": -112.1121,
        "lat": 36.1069
      },
      "category":[],
      "description": "One of the most visited national parks in the United States, known for its awe-inspiring views of the Grand Canyon.",
      "images": [
        "https://www.nps.gov/grca/planyourvisit/images/Grand-Canyon-view-wilderness-river-sunset_1.jpg",
        "https://www.nps.gov/grca/planyourvisit/images/Grand-Canyon-view-wilderness-river-sunset_2.jpg"
      ]
    },
    {
      "url": "https://www.disneyland.com/",
      "name": "Disneyland Park",
      "coordinates": {
        "lng": -117.9189,
        "lat": 33.8121
      },
      "category":[],
      "description": "One of the most iconic theme parks in the world, located in Anaheim, California.",
      "images": [
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1280/720/75/dam/disneyland/home/destination/dlr_Hero_destination_full_767x431.jpg?1594128734436",
        "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1280/720/75/dam/disneyland/home/destination/dlr_Hero_attractions_full_767x431.jpg?1594133181294"
      ]
    },
    {
      "url": "https://www.nps.gov/yell/index.htm",
      "name": "Yellowstone National Park",
      "coordinates": {
        "lng": -110.7002,
        "lat": 44.4279
      },
      "category":[],
      "description": "The first national park in the world, known for its geothermal features and wildlife.",
      "images": [
        "https://www.nps.gov/common/uploads/structured_data/3C86EB6B-1DD8-B71B-0BE6E0A7A8E1CE22.jpg",
        "https://www.nps.gov/common/uploads/structured_data/3C86EB6B-1DD8-B71B-0BE27D9B72829723.jpg"
      ]
    }];

jest.setTimeout(10000)


/*
----------------------------//TODO test this ----------------------------
No me esta cargando bien el mapa, los tests creo que mas o menos estan decentes pero no me estan pasando los
tests basicos porque no detecta que el mapa este cargado y de ahi ya no se pueden seguir haciendo tests.

*/ 



test('check map loads correctly',async () => {
    jest
    .spyOn(ReactGoogleMapsApi, "useJsApiLoader")
    .mockReturnValue({
      isLoaded: true,
      loadError: undefined
    });
    const {getByTestId}= render(<Map locations={testLocations} changeViewTo={()=>{}} deleteLocation={()=>{}}></Map>)
    //we expect the map to be loaded in the screen

    screen.debug()
    await waitFor(()=>expect (getByTestId('map')).toBeInTheDocument())
})

// test('Check with no locations no markers in map',async () => {
//     const {container}= render(<Map locations={[]} changeViewTo={()=>{}} deleteLocation={()=>{}}></Map>)
//     //we check with no locations = no markers
//     const markers = container.querySelectorAll('div[role="button"] img');
//     expect(markers.length).toBe(0)
// })

// test('Check with 1 locations 1 marker in the map',async () => {
//     const {container}= render(<Map locations={[testLocations[0]]} changeViewTo={()=>{}} deleteLocation={()=>{}}></Map>)
//     expect(container.querySelector('div[role="button"] img')).toBeInTheDocument()
// })

// test('Check with n locations n marker in the map',async () => {
//     const {container}= render(<Map locations={testLocations} changeViewTo={()=>{}} deleteLocation={()=>{}}></Map>)
    
//     await waitFor(() => expect(container.querySelector('div[role="button"] img')).toBeInTheDocument())
//     let markers = container.querySelectorAll('div[role="button"] img')
//     expect(markers.length).toBe(testLocations.length)
// })






//This is tested in the location small info card
// test('Check click on a location to open location details',async () => {
//     let selectedView = <></>
//     //we modify this variable on change of view
//     const {container}= render(<Map locations={testLocations} changeViewTo={(view)=>{ selectedView = view}} deleteLocation={()=>{}}></Map>)
//     expect(container.querySelector('[aria-label="Mapa"]'))
//     //we wait the marker to appear
//     await waitFor(() => container.querySelector('div[role="button"]'));
//     //store it in a variable
//     let marker = container.querySelector('div[role="button"]'); //! ensures no null value
//     //we click the marker
//     fireEvent.click(marker as Element);
//     //we wait for the selected view to update
//     await waitFor(() => expect(selectedView).not.toEqual(<></>));
// })

