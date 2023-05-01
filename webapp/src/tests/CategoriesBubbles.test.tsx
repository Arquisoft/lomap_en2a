import React from 'react'
import { render,fireEvent,act,screen  } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import AddLocationForm from "../components/locations/AddLocationForm";
import { Location } from '../types/types';
import CategoriesBubbles from '../components/locations/CategoriesBubbles';

const testLocation : Location = {
  name: "Central Park",
  coordinates: {
    lng: -73.9688,
    lat: 40.7851,
  },
  description: "A large public park in Manhattan, New York City.",
  category: ["Park","Sigth","testCategoryw"],
  reviews: [
    {
      webId: "https://example.com/user1",
      date: "2022-04-27",
      title: "Beautiful Park",
      content: "I loved spending time in Central Park. It's so peaceful and relaxing.",
      username: "user1",
    },
    {
      webId: "https://example.com/user2",
      date: "2022-04-28",
      title: "Great Place to Exercise",
      content: "I come here every morning to jog. The paths are great and the scenery is beautiful.",
      username: "user2",
    },
    {
      webId: "https://example.com/user3",
      date: "2022-04-29",
      title: "Crowded on weekends",
      content: "I visited on a Saturday afternoon and it was really crowded. Go on a weekday if you can.",
      username: "user3",
    },
  ],
  ratings: new Map([
    ["https://example.com/user1", 4],
    ["https://example.com/user2", 5],
    ["https://example.com/user3", 3],
  ]),
  images: [
    "https://example.com/central-park-1.jpg",
    "https://example.com/central-park-2.jpg",
  ],
};

//test with a location with no categories
test('check categories rendered',async () => {
    const {getByTestId}= render(<CategoriesBubbles location={testLocation}></CategoriesBubbles>)
    //we check the categories from the location are rendered
    testLocation.category.forEach((category)=>{
        expect(getByTestId('category-bubble-'+category)).toBeInTheDocument();
    })
})