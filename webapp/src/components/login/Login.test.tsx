import React from 'react'
import { act, fireEvent, render } from "@testing-library/react";
import Login from "./Login";

/*
    Still have to test the correct behavoir of the login and the prevent default
    Current coverage = 73.33%
*/

test('check logo appears in login view',async () => {
    const {container}= render(<Login></Login>)
    expect(container.querySelector('img')).toBeInTheDocument();
})

test('check first option is selected by default',async () => {
    const {container}= render(<Login></Login>)
    expect(container.querySelector('input')).toBeChecked();
})

test('check when clicked last radio the input box for the custom provider appears',async () => {
    const {container,getByTestId}= render(<Login></Login>)
    expect(getByTestId('inputCustomPodProvider')).toHaveStyle({ visibility: 'hidden' })
    let inputs = container.querySelectorAll('input');
    let lastInput = inputs.item(inputs.length-2);
    lastInput.click()
    //we check text box appeared
    expect(getByTestId('inputCustomPodProvider')).toHaveStyle({ visibility: 'visible' })
})

test('check user choice changes when value inputed in text box',async () => {
    const {container,getByTestId}= render(<Login></Login>)
    expect(getByTestId('inputCustomPodProvider')).toHaveStyle({ visibility: 'hidden' })
    let inputs = container.querySelectorAll('input');
    let lastInput = inputs.item(inputs.length-2);
    lastInput.click()
    // create a spy on the setState method of the Login component

    const setStateSpy = jest.spyOn(React, 'useState');

    // simulate a change event on the input field
    const inputField = getByTestId('inputCustomPodProvider');
    fireEvent.change(inputField, { target: { value: 'new value' } });

    // check that the setState method was called with the expected arguments
    expect(setStateSpy).toHaveBeenCalledWith('new value');
})