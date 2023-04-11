import React from 'react'
import { render } from "@testing-library/react";
import LocationCard from "./LocationCard";
import LocationInfo from './LocationInfo';
import noImage from '../no-pictures-picture.png';

const testLocation = 
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
      ]
    };

test('check name displays correctly',async () => {
    const {getByText}= render(<LocationCard loadLocations={jest.fn()} place={testLocation} setSelectedView={()=>{}} key={1}></LocationCard>)
    expect(getByText(testLocation.name)).toBeInTheDocument();
})

test('check description displays correctly',async () => {
    const {getByText}= render(<LocationCard loadLocations={jest.fn()} place={testLocation} setSelectedView={()=>{}} key={1}></LocationCard>)
    const truncatedDescription = testLocation.description.split(' ').slice(0, 5).join(' '); // truncate to first 5 words
    expect(getByText(new RegExp(`^${truncatedDescription}`))).toBeInTheDocument();
})

test('check image displays correctly when image in location',async () => {
    const {container}= render(<LocationCard loadLocations={jest.fn()} place={testLocation} setSelectedView={()=>{}} key={1}></LocationCard>)
    expect(container.querySelector("img[src='https://www.metmuseum.org/-/media/images/visit/met-fifth-ave/met-5thave-exterior2-1024x640.jpg']")).toBeInTheDocument();
})

test('check image displays correctly when NO image in location',async () => {
    let locationWithouImage = {
        "url": "https://www.nycgo.com/attractions/the-metropolitan-museum-of-art/",
        "name": "The Metropolitan Museum of Art",
        "coordinates": {
          "lng": -73.9632,
          "lat": 40.7794
        },
        "category":[],
        "description": "One of the world's largest and finest art museums, located in New York City.",
        "images": []
      };
    const {container}= render(<LocationCard loadLocations={jest.fn()} place={locationWithouImage} setSelectedView={()=>{}} key={1}></LocationCard>)
    //we expect it to have loaded the 'no image' image for the locations
    //by checking if the src of the image contains the name of the no images image
    expect(container.querySelector('img')?.getAttribute('src')).toMatch(/no-pictures-picture/);
})

test('check change view on click to show location info expanded',async () => {
    let selected = <></>
    const {container}= render(<LocationCard loadLocations={jest.fn()} place={testLocation} setSelectedView={(view)=>{selected = view}} key={1}></LocationCard>)
    //we click on the container
    container.querySelector('img')?.click()

    //we check selected view has changed
    expect(selected).not.toEqual(<></>)
})