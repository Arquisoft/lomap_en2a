import React from 'react'
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Menu from "./Menu";

test('check menu contains 5 options',async () => {
  const{container} = render(<Menu addLocation={jest.fn()} deleteLoc={jest.fn()} locations={[]} setSelectedView={jest.fn()}></Menu>)
  //we check there are 5 icons = svg
  expect(container.querySelectorAll('svg').length).toBe(5)
})

test('check menu expands when mouse enters', async () => {
    const { getByTestId } = render(
      <Menu addLocation={jest.fn()} deleteLoc={jest.fn()} locations={[]} setSelectedView={jest.fn()} />
    );
    //we expect the small component to be in the document
    expect(getByTestId('smallContainer')).toBeInTheDocument()
    // enter the menu with the mouse
    fireEvent.mouseEnter(getByTestId('smallContainer'));
    // wait for the component to update
    expect(getByTestId('bigContainer')).toBeInTheDocument()
  });
