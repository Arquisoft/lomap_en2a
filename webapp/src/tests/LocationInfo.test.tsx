import React from 'react'
import { act, render, screen, fireEvent } from "@testing-library/react";
import LocationInfo from '../components/locations/LocationInfo';
import { Location } from '../types/types';
import userEvent from '@testing-library/user-event';



const testLocation : Location =
{
  name: "Location alone",
  coordinates: { lng: 1.234, lat: 5.678 },
  description: "Short description alone",
  category: [],
  reviews: [{
    "webId": "abc123",
    "username":"usr",
    "date": new Date("2022-03-15T12:00:00Z").toLocaleString(),
    "title": "Amazing experience",
    "content": "I recently visited this location and was blown away by the beautiful scenery and friendly staff. The location was easy to find and exceeded my expectations in every way. I highly recommend this spot to anyone looking for a peaceful and memorable experience."
  },
  {
    "webId": "def456",
    "username":"usr",
    "date": new Date("2022-03-15T12:00:00Z").toLocaleString(),
    "title": "Disappointing experience",
    "content": "I was excited to visit this location based on the reviews, but unfortunately it didn't live up to my expectations. The scenery was nice, but the staff wasn't very friendly and the facilities were not well-maintained. I wouldn't recommend this spot."
  },
  {
    "webId": "ghi789",
    "username":"usr",
    "date": new Date("2022-05-01T10:00:00Z").toLocaleString(),
    "title": "Great location for hiking",
    "content": "I had a fantastic time hiking at this location. The trails were well-marked and provided stunning views of the surrounding area. The staff was helpful and provided useful information about the trails. I highly recommend this spot for anyone looking for a challenging and rewarding hiking experience."
  }

  ],
  images: [
    "https://www.metmuseum.org/-/media/images/visit/met-fifth-ave/met-5thave-exterior2-1024x640.jpg",
    "https://www.metmuseum.org/-/media/images/about-the-met/mission-history/history/european-paintings/gallery-paintings/19800116_picasso_lg.jpg"
  ],
  ratings: new Map<string, number>([["webId1", 1], ["webId2", 2], ["webId2", 3], ["webId2", 4], ["webId2", 5]])
};

test('check title shows in view', async () => {
  const { getByText } = render(<LocationInfo setSelectedView={()=>{}} location={testLocation} loadLocations={jest.fn()} ></LocationInfo>)
  await act(async () => {
    expect(getByText(testLocation.name)).toBeInTheDocument();
  })
})

test('check description shows in view', async () => {
  const { getByText } = render(<LocationInfo setSelectedView={()=>{}} location={testLocation} loadLocations={jest.fn()} ></LocationInfo>)
  await act(async () => {
    expect(getByText(testLocation.description)).toBeInTheDocument();
  })
})

test('check images shows in view', async () => {
  const { container } = render(<LocationInfo setSelectedView={()=>{}} location={testLocation} loadLocations={jest.fn()} ></LocationInfo>)
  // await act(async () => {
    expect(container.querySelectorAll("img").length).toBe(testLocation.images?.length);
  // })
})

test('check reviews are displayed correctly', async () => {
  const { getByText,getByTestId } = render(<LocationInfo setSelectedView={()=>{}} location={testLocation} loadLocations={jest.fn()} ></LocationInfo>)

  getByTestId('review-button').click();

  
    testLocation.reviews?.forEach(review => {
      expect(getByText(review.title)).toBeInTheDocument();
    
  })
})
