import React from 'react'
import { act, render } from "@testing-library/react";
import LocationInfo from "./LocationInfo";


const testLocation = 
{
  name: "Location alone",
  coordinates: { lng: 1.234, lat: 5.678 },
  description: "Short description alone",
  reviews: [],
  ratings: new Map<string, number>([["webId1", 1],["webId2", 2],["webId2", 3],["webId2", 4],["webId2", 5]])
};

test('check title shows in view',async () => {
    const {getByText}= render(<LocationInfo location={testLocation} deleteLocation={jest.fn()} ></LocationInfo>)
    expect(getByText(testLocation.name)).toBeInTheDocument();
})

test('check description shows in view',async () => {
  const {getByText}= render(<LocationInfo location={testLocation} deleteLocation={jest.fn()} ></LocationInfo>)
  expect(getByText(testLocation.description)).toBeInTheDocument();
})

test('check ratings are shown in view',async () => {
  const {getByTestId}= render(<LocationInfo location={testLocation} deleteLocation={jest.fn()} ></LocationInfo>)
  //we will check the number of reviews
  expect(getByTestId('nRatings').textContent).toBe(testLocation.ratings.size.toString());
  //we check the average to be well computed
  expect(getByTestId('avgRatings').textContent).toBe('3')
  
})