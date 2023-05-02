import React from 'react'
import { render,fireEvent,act,screen  } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import AddLocationForm from "../components/locations/AddLocationForm";
import { Location } from '../types/types';
import {TutorialModalDialog} from '../components/dialogs/TutorialModalDialog';

//test the the view shows the word "Tutorial"
test('check the tutorial modal dialog is on the screen',async () => {
    const {getByText}= render(<TutorialModalDialog></TutorialModalDialog>)
    expect(getByText('Tutorial')).toBeInTheDocument();
})

//test the text 'You can add a location easily!' appear on the screen when the second slide is on
test('check the text "You can add a location easily!" appear on the screen when the second slide is on',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()

    const nextButton = getByTestId('move-to-page-2')
    fireEvent.click(nextButton)
    expect(getByTestId('tutorial-page-2')).toBeInTheDocument();
})

//we go to the third tab and go back to the second
test('the back page button works fine',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()

    //move to the scond tab
    const nextButton = getByTestId('move-to-page-2')
    fireEvent.click(nextButton)
    expect(getByTestId('tutorial-page-2')).toBeInTheDocument();

    //move back to the first tab
    const backButton = getByTestId('move-to-page-1')
    fireEvent.click(backButton)
    expect(getByTestId('tutorial-page-1')).toBeInTheDocument();

})

//we move to the last tab and go back to the first one
test('iterate over all the views',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()
    for(let i=1;i<5;i++){
        const nextButton = getByTestId('move-to-page-'+(i+1))
        fireEvent.click(nextButton)
        expect(getByTestId('tutorial-page-'+(i+1))).toBeInTheDocument();
        expect(getByTestId('body-tutorial-page-'+(i+1))).toBeInTheDocument();
    }
})

//check links to the views in the first pannel work
test('check link to first page works to the views in the first pannel work',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()
    getByTestId('link-to-first-page').click()
    expect(getByTestId('tutorial-page-2')).toBeInTheDocument();
})

//check links to the views in the first pannel work
test('check link to second page works to the views in the first pannel work',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()
    getByTestId('link-to-second-page').click()
    expect(getByTestId('tutorial-page-3')).toBeInTheDocument();
})

//check links to the views in the first pannel work
test('check link to third page works to the views in the first pannel work',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()
    getByTestId('link-to-third-page').click()
    expect(getByTestId('tutorial-page-4')).toBeInTheDocument();
})

//check links to the views in the first pannel work
test('check link to last page works to the views in the first pannel work',async () => {
    const {getByTestId}= render(<TutorialModalDialog></TutorialModalDialog>)
    //we click the button that activates the tutorial
    getByTestId('Tutorial').click()
    getByTestId('link-to-last-page').click()
    expect(getByTestId('tutorial-page-5')).toBeInTheDocument();
})



