import React from 'react'
import { render,fireEvent,act,screen  } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import EditLocationFormComp from "../components/locations/EditLocation";
import { Location } from '../types/types';

const testLocation : Location = {
    name: "Central Park",
    coordinates: {
      lng: -73.9688,
      lat: 40.7851,
    },
    description: "A large public park in Manhattan, New York City.",
    category: ["Park","Sigth"],
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

  const testLocation2 : Location = {
    name: "Central Park",
    coordinates: {
      lng: -73.9688,
      lat: 40.7851,
    },
    description: "A large public park in Manhattan, New York City.",
    category: [],
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

//we test that writting in the name input works
test('check that the name input works',async () => {
    const {getByTestId}= render(<EditLocationFormComp location={testLocation} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
    const inputElement = getByTestId("name-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Location name');
    //we change the value of the input to 'Los Angeles'
    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Los Angeles' } })
    });
    expect(inputElement.value).toBe('Los Angeles');

})

//we test that writting in the description input works
test('check that the description input works',async () => {
    const {getByTestId}= render(<EditLocationFormComp location={testLocation} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
    const inputElement = getByTestId("description-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();

    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Description' } })
    });
    expect(inputElement.value).toBe('Description');

})

//we test that writting wrong coordinates in the coordinates input doesnt work
test('check that the coordinates input doesnt work with wrong coordinates',async () => {
    const {getByTestId}= render(<EditLocationFormComp location={testLocation} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
    const inputElement = getByTestId("coordinates-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    //we change the value of the input to 'Los Angeles'
    act(() => {
      fireEvent.change(inputElement, { target: { value: 'Los Angeles' } })
    });
    expect(inputElement.value).toBe('Los Angeles');
    //we check that the error message appears
    expect(getByTestId('coord-error')).toBeInTheDocument();

    
    
    
})






test('selects a category that is checked', async () => {
    const {getByTestId}= render(<EditLocationFormComp location={testLocation} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
  
      userEvent.click(getByTestId('categories-button'));
      
  let cb = getByTestId('Sight')
  act(() => {
    userEvent.click(cb);
  });
  expect(cb).toHaveAttribute('aria-checked', 'false');
});


test('edits location', async () => {
    const {getByTestId}= render(<EditLocationFormComp location={testLocation2} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
  const nameInput = getByTestId("name-input") as HTMLInputElement;

  act(() => {
    fireEvent.change(nameInput, { target: { value: 'Los Angeles' } })
  });
  expect(nameInput.value).toBe('Los Angeles');
  const descriptionInput = getByTestId("description-input") as HTMLInputElement;

  act(() => {
    fireEvent.change(descriptionInput, { target: { value: 'Description' } })
  });
  expect(descriptionInput.value).toBe('Description');
  const coordinatesInput = getByTestId("coordinates-input") as HTMLInputElement;

  act(() => {
    fireEvent.change(coordinatesInput, { target: { value: '40.416775,-3.703790' } })
  });
  expect(coordinatesInput.value).toBe('40.416775,-3.703790');

  //click the button
  let button = getByTestId('edit-location-button')
  
  act(() => {
    userEvent.click(button);
  });

  // wait for state updates to occur
  await new Promise((resolve) => setTimeout(resolve, 0));


  expect(button).toBeDisabled()
  
})

test('close button', async () => {
  const setSelectedView = jest.fn();
  const setClickedCoordinates = jest.fn();
  const {getByTestId}= render(<EditLocationFormComp location={testLocation} setSelectedView={setSelectedView} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={setClickedCoordinates} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()} locations={[]} setOwnLocations={jest.fn()}></EditLocationFormComp>)
  const closeButton = getByTestId("close-button") ;

  act(() => {
    fireEvent.click(closeButton);
  });

expect(setSelectedView).toHaveBeenCalledWith('Map');
expect(setClickedCoordinates).toHaveBeenCalledWith('');
  
})


