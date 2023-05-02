import React from 'react'
import { act, render } from "@testing-library/react";
import { ProfileView } from '../components/profile/ProfileInfo'; 
import {useSession} from  '@inrupt/solid-ui-react';


const testLocation = 
{
    name: "Location alone",
    coordinates: { lng: 1.234, lat: 5.678 },
    description: "Short description alone",
    reviews: [],
    category:[],
    ratings: new Map<string, number>([["webId1", 5]])
  };

const testArray5Ratings = [
    {
    name: "Location 1",
    coordinates: { lng: 1.234, lat: 5.678 },
    description: "Short description 1",
    reviews: [],
    category:[],
    ratings: new Map<string, number>([["webId1", 1], ["webId2", 1], ["webId3", 1]])
},
  {
    name: "Location 2",
    coordinates: { lng: 2.345, lat: 6.789 },
    description: "Short description 2",
    reviews: [],
    category:[],
    ratings: new Map<string, number>([["webId1", 2], ["webId2", 2], ["webId3", 2]])
  },
  {
      name: "Location 3",
    coordinates: { lng: 3.456, lat: 7.890 },
    description: "Short description 3",
    reviews: [],
    category:[],
    ratings: new Map<string, number>([["webId1", 3], ["webId2", 3], ["webId3", 3]])
},
  {
    name: "Location 4",
    coordinates: { lng: 4.567, lat: 8.901 },
    description: "Short description 4",
    reviews: [],
    category:[],
    ratings: new Map<string, number>([["webId1", 4], ["webId2", 4], ["webId3", 4]])
  },
  {
      name: "Location 5",
      coordinates: { lng: 5.678, lat: 9.012 },
      description: "Short description 5",
      reviews: [],
      category:[],
      ratings: new Map<string, number>([["webId1", 5], ["webId2", 5], ["webId3", 5]])
    }
];



// TESTS ON STATS --------------------------------------------------------------------------------------------

test('check number of locations loaded correctly -> 0 locations',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=> {}} locations={[]}></ProfileView>)
    expect(getByTestId('nLocations').textContent).toBe('0');
})

test('check number of locations loaded correctly -> 1 location',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=> {}} locations={[testLocation]}></ProfileView>)
    expect(getByTestId('nLocations').textContent).toBe('1');
})

test('check number of locations loaded correctly -> 5 locations',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=> {}} locations={testArray5Ratings}></ProfileView>)
    expect(getByTestId('nLocations').textContent).toBe('5');
})

test('check avg value for reviews when NO locations -> avg = No reviews',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=> {}} locations={[]}></ProfileView>)
    expect(getByTestId('avgRatings').textContent).toBe('No ratings');
})

test('check avg value for reviews when 1 locations, rating 5 stars -> avg = 5.00',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=>{} } locations={[testLocation]}></ProfileView>)
    expect(getByTestId('avgRatings').textContent).toBe('5.00');
})

test('check avg value for reviews when 5 locations, rating 1s,2s,3s,4s,5s stars -> avg = 3.00',async () => {
    const {getByTestId}= render(<ProfileView setSelectedView={(view)=> {}} locations={testArray5Ratings}></ProfileView>)
    expect(getByTestId('avgRatings').textContent).toBe('3.00');
})