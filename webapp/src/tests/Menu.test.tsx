import React from 'react'
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Menu from '../components/menu/Menu';

test('check menu contains 7 options', async () => {
  const { container } = render(<Menu
      loading={false} loadLocations={jest.fn()} loadUserLocations={jest.fn()} ownLocations={[]}
  friendLocations={[]} changeViewTo={jest.fn()} setClickedCoordinates={jest.fn()}
  clickedCoordinates={'0,0'}></Menu>)
  //we check there are 7 icons = svg
  expect(container.querySelectorAll('svg').length).toBe(7)
})

test('check menu expands when mouse clicks', async () => {
  const { getByTestId } = render(<Menu
      loading={false} loadLocations={jest.fn()} loadUserLocations={jest.fn()} ownLocations={[]}
  friendLocations={[]} changeViewTo={jest.fn()} setClickedCoordinates={jest.fn()}
  clickedCoordinates={'0,0'}/>
  );
  //we expect the small component to be in the document
  expect(getByTestId('smallContainer')).toBeInTheDocument()
  // enter the menu with the mouse
  fireEvent.click(getByTestId('smallContainer'));
  // wait for the component to update
  expect(getByTestId('bigContainer')).toBeInTheDocument()
});

test('check menu shrinks when mouse exits', async () => {
  const { getByTestId } = render(<Menu
      loading={false} loadLocations={jest.fn()} loadUserLocations={jest.fn()} ownLocations={[]}
  friendLocations={[]} changeViewTo={jest.fn()} setClickedCoordinates={jest.fn()}
  clickedCoordinates={'0,0'}/>
  );
  // enter the menu with the mouse
  fireEvent.click(getByTestId('smallContainer'));

  //we expect the big component to be in the document
  expect(getByTestId('bigContainer')).toBeInTheDocument()
  // exit the menu with the mouse
  fireEvent.mouseLeave(getByTestId('bigContainer'));
  // wait for the component to update
  expect(getByTestId('smallContainer')).toBeInTheDocument()
});

test.each(['Map View', 'List of Locations', 'Add Location', 'Add Friends','Progress','Profile'])(
  'clicking %s updates the view',
  async (buttonText) => {
    let viewUpdated = false;
    const { getByTestId,getByText } = render(
      <Menu
        loading={false}
        loadLocations={jest.fn()}
        ownLocations={[]}
        loadUserLocations={jest.fn()}
        friendLocations={[]}
        changeViewTo={(view) => {
          viewUpdated = true;
        }}
        setClickedCoordinates={jest.fn()}
        clickedCoordinates={'0,0'}
      />
    );
    // click the menu 
    fireEvent.click(getByTestId('smallContainer'));
    // get the button by its text content
    const button = getByTestId(buttonText)
    // const button = getAllByRole('button', { name: buttonText })[0];
    expect(getByTestId('bigContainer')).toBeInTheDocument();

    // click the button
    await act(async () => {
      button.click();
    })
    // expect the view to have been updated
    expect(viewUpdated).toBe(true);
    // enter the menu with the mouse
    await act(async () => {
      fireEvent.mouseEnter(getByTestId('smallContainer'));
    })
  }
);



