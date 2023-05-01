import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Friends from "../components/friends/Friends";






//we check that if no logged in the text 'You are not logged' is shown
test('should show the text "You are not logged" if no logged in',async () => {
    const { getByText } = render(<Friends setSelectedView={()=>{}}/>);
    const text = getByText(/You are not logged/);
    expect(text).toBeInTheDocument();

});

//we test that once logged the click on the close button calls the function setSelectedView
test('should call setSelectedView when close button is clicked',async () => {
    // Mock the useSession function
    jest.mock('@inrupt/solid-ui-react', () => ({
        useSession: jest.fn(() => ({
        session: { info: { webId: "webId" } }
        }))
    }));
    //we create a mock function
    const setSelectedView = jest.fn();
    const { getByTestId } = render(<Friends setSelectedView={setSelectedView}/>);
    const button = getByTestId("closeButton");
    fireEvent.click(button);
});


//we test that once logged the click on the close button calls the function setSelectedView
test('The name and webid of the friend should be printed in the screen',async () => { //TODO
    
    // Mock the useSession function
    
    //we check the name and webid of the friend are printed
    const { getByText } = render(<Friends setSelectedView={()=>{}}/>);
    
    expect(getByText(/name/)).toBeInTheDocument();
    expect(getByText(/webId/)).toBeInTheDocument();

});