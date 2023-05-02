import React from 'react'
import { render,fireEvent,act,screen  } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import AddLocationForm from "../components/locations/AddLocationForm";
import { Location } from '../types/types';
import App from '../App';

test('check the login page appears on the window',async () => {
    const {getByText}= render(<App></App>)
    expect(getByText('Login')).toBeInTheDocument();
})

//we check the button to add a location is on the screen
test('check the button to add a location is on the screen',async () => {
    const {getByTestId}= render(<App></App>)
    expect(getByTestId('add-location-button-corner')).toBeInTheDocument();
})

//we check the map is on the screen
test('check the map is on the screen',async () => {
    const {getByTestId}= render(<App></App>)
    expect(getByTestId('google-maps-map')).toBeInTheDocument();
})

//we check menu is being shown
test('check menu is being shown',async () => {
    const {getByTestId}= render(<App></App>)
    expect(getByTestId('smallContainer')).toBeInTheDocument();
})


