import React from 'react'
import { render } from "@testing-library/react";
import LocationCard from '../components/locations/LocationCard';
import LocationInfo from '../components/locations/LocationInfo';
import noImage from '../no-pictures-picture.png';
import { Location } from '../types/types';

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


test('check name displays correctly',async () => {
    const {getByText}= render(<LocationCard setSelectedLocation={jest.fn()} loadLocations={jest.fn()} place={testLocation} setSelectedView={()=>{}} key={1}></LocationCard>)
    expect(getByText(testLocation.name)).toBeInTheDocument();
})

test('check description displays correctly',async () => {
    const {getByText}= render(<LocationCard setSelectedLocation={jest.fn()} loadLocations={jest.fn()} place={testLocation} setSelectedView={()=>{}} key={1}></LocationCard>)
    const truncatedDescription = testLocation.description.split(' ').slice(0, 5).join(' '); // truncate to first 5 words
    expect(getByText(new RegExp(`^${truncatedDescription}`))).toBeInTheDocument();
})

test('check first displays correctly when image in location', async () => {
  const { container } = render(
    <LocationCard
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      place={testLocation}
      setSelectedView={() => {}}
      key={1}
    ></LocationCard>
  );
  // We expect it to have loaded all the images of the location
  // by checking if the src of the image contains the name of the image
  //we get the images on the screen
  let image = container.querySelector('img');
  //we check the src of the image contains the name of the first image of the location
  if(testLocation.images)
    expect(image?.getAttribute('src')).toMatch(testLocation.images[0]);
});


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
    const {container}= render(<LocationCard setSelectedLocation={jest.fn()} loadLocations={jest.fn()} place={locationWithouImage} setSelectedView={()=>{}} key={1}></LocationCard>)
    //we expect it to have loaded the 'no image' image for the locations
    //by checking if the src of the image contains the name of the no images image
    expect(container.querySelector('img')?.getAttribute('src')).toMatch(/no-pictures-picture/);
})

test('check change view on click to show location info expanded',async () => {
    let selected = ''
    const {container}= render(<LocationCard setSelectedLocation={jest.fn()} loadLocations={jest.fn()} place={testLocation} setSelectedView={(view)=>{selected = view}} key={1}></LocationCard>)
    //we click on the container
    container.querySelector('img')?.click()

    //we check selected view has changed
    expect(selected).not.toEqual('')
})

//we test the location the rating is displayed correctly in the location card
test('check rating is displayed correctly when no ratings in the location',async () => {
  let locationWithouRating:Location = {
    name: "Central Park",
    coordinates: {
      lng: -73.9688,
      lat: 40.7851,
    },
    description: "A large public park in Manhattan, New York City.",
    category: ["Park"],
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
    ratings: new Map([]),
    images: [
      "https://example.com/central-park-1.jpg",
      "https://example.com/central-park-2.jpg",
    ],
  }

  const { getByTestId } = render(
    <LocationCard
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      place={locationWithouRating}
      setSelectedView={() => {}}
      key={1}
    ></LocationCard>
  );
  //we expect the location star rating to be 0
  let expectedSelections = [false,false,false,false,false];
  expectedSelections.forEach((isSelected, index) => {
    expect(getByTestId(`star${index}${isSelected? 'selected':'unselected'}`)).toBeInTheDocument();
  });
});

//we test the location the rating is displayed correctly in the location card when more than 0 ratings
test('check rating is displayed correctly when more than 0 ratings in the location',async () => {
  const { getByTestId } = render(
    <LocationCard
      setSelectedLocation={jest.fn()}
      loadLocations={jest.fn()}
      place={testLocation}
      setSelectedView={() => {}}
      key={1}
    ></LocationCard>
  );
  //we expect the location star rating to be 4
  //there must be 4 selected stars and 1 unselected star
  //this means the star3selected must be present and the star0unselected must be present
  expect(getByTestId('star3selected')).toBeInTheDocument();
  expect(getByTestId('star0unselected')).toBeInTheDocument();
});

//we test the categories are displayed correctly in the location card
test('check categories are displayed correctly in the location card',async () => {
  const { getByText } = render(
    <LocationCard
    setSelectedLocation={jest.fn()}
    loadLocations={jest.fn()}
    place={testLocation}
    setSelectedView={() => {}}
    key={1}
  ></LocationCard>
  );
  //we expect the location categories to be displayed
  testLocation.category.forEach((category) => {
    expect(getByText(category)).toBeInTheDocument();
  });
});


    