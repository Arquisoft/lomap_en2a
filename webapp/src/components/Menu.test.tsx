import React from 'react'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Menu from "./Menu";

test('check menu contains 5 options',async () => {
  const{container} = render(<Menu loadLocations={jest.fn()} locations={[]} changeViewTo={jest.fn()}></Menu>)
  //we check there are 5 icons = svg
  expect(container.querySelectorAll('svg').length).toBe(5)
})

test('check menu expands when mouse enters', async () => {
    const { getByTestId } = render(<Menu loadLocations={jest.fn()}  locations={[]} changeViewTo={jest.fn()} />
    );
    //we expect the small component to be in the document
    expect(getByTestId('smallContainer')).toBeInTheDocument()
    // enter the menu with the mouse
    fireEvent.mouseEnter(getByTestId('smallContainer'));
    // wait for the component to update
    expect(getByTestId('bigContainer')).toBeInTheDocument()
  });

test('check menu shrinks when mouse exits', async () => {
    const { getByTestId } = render(<Menu loadLocations={jest.fn()}  locations={[]} changeViewTo={jest.fn()} />
    );
    // enter the menu with the mouse
    fireEvent.mouseEnter(getByTestId('smallContainer'));

    //we expect the big component to be in the document
    expect(getByTestId('bigContainer')).toBeInTheDocument()
    // exit the menu with the mouse
    fireEvent.mouseLeave(getByTestId('bigContainer'));
    // wait for the component to update
    expect(getByTestId('smallContainer')).toBeInTheDocument()
});

test.each(['Map view', 'Location list', 'Add location','Add friends','Profile'])(
    'clicking %s updates the view',
    async (buttonText) => {
      let viewUpdated = false;
      const { getByTestId } = render(
        <Menu 
          loadLocations={jest.fn()}
          locations={[]}
          changeViewTo={(view) => {
            viewUpdated = true;
          }}
        />
      );
      // enter the menu with the mouse
      fireEvent.mouseEnter(getByTestId('smallContainer'));
      // get the button by its text content
      const button = getByTestId(buttonText)
      // const button = getAllByRole('button', { name: buttonText })[0];
      expect(getByTestId('bigContainer')).toBeInTheDocument();
      
      // click the button
      button.click();
      // expect the view to have been updated
      expect(viewUpdated).toBe(true);
      // enter the menu with the mouse
      fireEvent.mouseEnter(getByTestId('smallContainer'));
    }
  );
  


