import React from 'react'
import { render } from "@testing-library/react";
import { DeletingAlertDialog } from '../components/dialogs/DeletingLocationAlertDialog';
import userEvent from '@testing-library/user-event';


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

test('check component displays correctly',async () => {
    const {getByTestId}= render(<DeletingAlertDialog/>);
    expect(getByTestId('delete-button')).toBeInTheDocument();
})


test('click delete button',async () => {
    const {getByTestId}= render(<DeletingAlertDialog/>);
    expect(getByTestId('delete-button')).toBeInTheDocument();
    const b = getByTestId('delete-button');
    userEvent.click(b);
    expect(getByTestId('warning-message')).toBeInTheDocument();
})

test('delete location',async () => {
    const {getByTestId}= render(<DeletingAlertDialog location={testLocation}/>);
    expect(getByTestId('delete-button')).toBeInTheDocument();
    const b = getByTestId('delete-button');
    userEvent.click(b);
    expect(getByTestId('warning-message')).toBeInTheDocument();
    const c = getByTestId('delete-button2');
    userEvent.click(c);
    
})