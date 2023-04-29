import React from 'react'
import { render,fireEvent,act,screen  } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import AddLocationForm from "../components/locations/AddLocationForm";

//we test that writting in the name input works
test('check that the name input works',async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const inputElement = getByTestId("name-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Location name');
    expect(inputElement).toHaveAttribute('id', 'name');
    //we change the value of the input to 'Los Angeles'
    fireEvent.change(inputElement, { target: { value: 'Los Angeles' } })
    expect(inputElement.value).toBe('Los Angeles');

})

//we test that writting in the name input works
test('check that the description input works',async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const inputElement = getByTestId("description-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('placeholder', 'Location description');
    expect(inputElement).toHaveAttribute('id', 'description');
    //we change the value of the input to 'Los Angeles'
    fireEvent.change(inputElement, { target: { value: 'Description' } })
    expect(inputElement.value).toBe('Description');

})

//we test that writting wrong coordinates in the coordinates input doesnt work
test('check that the coordinates input doesnt work with wrong coordinates',async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const inputElement = getByTestId("coordinates-input") as HTMLInputElement;
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'coordinates');
    //we change the value of the input to 'Los Angeles'
    fireEvent.change(inputElement, { target: { value: 'Los Angeles' } })
    expect(inputElement.value).toBe('Los Angeles');
    //we check that the error message appears
    expect(getByTestId('coord-error')).toBeInTheDocument();
    //we change the value of the input to 'Los Angeles'
    
    
    
})

test('handles file upload correctly', async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const inputElement = getByTestId("image-input");

    const file = new File(['image data'], 'test.png', { type: 'image/png' });

    
    userEvent.upload(inputElement, file);
  });

test('handles image upload', async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const input = getByTestId('image-input') as HTMLInputElement;

    // create a mock file
    const file = new File(['image data'], 'test.png', { type: 'image/png' });

    // simulate file upload event
    act(() => {
      fireEvent.change(input, { target: { files: [file] } });
    });

    // wait for state updates to occur
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (input.files) {
        expect(input.files.length).toBe(1);
        expect(input.files[0].name).toBe('test.png');
      }

    // add more assertions as needed to check the component's state changes
  });

  test('selects a category', async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    
        userEvent.click(getByTestId('categories-button'));
        
    let cb = getByTestId('Shop')
    userEvent.click(cb);
    expect(cb).toHaveAttribute('aria-checked', 'true');
    
    
  });

  test('adds location', async () => {
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={jest.fn()} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={jest.fn()} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const nameInput = getByTestId("name-input") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Los Angeles' } })
    expect(nameInput.value).toBe('Los Angeles');
    const descriptionInput = getByTestId("description-input") as HTMLInputElement;

    fireEvent.change(descriptionInput, { target: { value: 'Description' } })
    expect(descriptionInput.value).toBe('Description');
    const coordinatesInput = getByTestId("coordinates-input") as HTMLInputElement;

    fireEvent.change(coordinatesInput, { target: { value: '40.416775,-3.703790' } })
    expect(coordinatesInput.value).toBe('40.416775,-3.703790');
    const input = getByTestId('image-input') as HTMLInputElement;

    // create a mock file
    const file = new File(['image data'], 'test.png', { type: 'image/png' });
    //input the file
    act(() => {
        fireEvent.change(input, { target: { files: [file] } });
        });
    // wait for state updates to occur
    await new Promise((resolve) => setTimeout(resolve, 0));
    //click the button
    let button = getByTestId('add-location-button')
    userEvent.click(button);
    // wait for state updates to occur
    await new Promise((resolve) => setTimeout(resolve, 0));
    //check that a toast appears
    expect(button).toBeDisabled()
    
  })

  test('close button', async () => {
    const setSelectedView = jest.fn();
    const setClickedCoordinates = jest.fn();
    const {getByTestId}= render(<AddLocationForm locations={[]} setSelectedView={setSelectedView} loadLocations={jest.fn()} loadUserLocations={jest.fn()} clickedCoordinates={""} setClickedCoordinates={setClickedCoordinates} setInLocationCreationMode={jest.fn()} setSelectedLocation={jest.fn()}></AddLocationForm>)
    const closeButton = getByTestId("close-button") ;

    fireEvent.click(closeButton);

  // Check that the appropriate functions were called with the expected arguments
  expect(setSelectedView).toHaveBeenCalledWith('Map');
  expect(setClickedCoordinates).toHaveBeenCalledWith('');
    
  })

/**
test('check that the location list renders propertly',async () => {
    const {getByText}= render(<ListOfLocations setSelectedLocation={jest.fn()} loadLocations={jest.fn()} loading={false} ownLocations={testLocations} friendLocations={[]} setSelectedView={()=>{}}></ListOfLocations>)
    testLocations.forEach(location => {
        let name = location.name;
        expect(getByText(name)).toBeInTheDocument();
    });
})

test('check that with no location the loading squeletons appear',async () => {w
    const {getByTestId}= render(<ListOfLocations setSelectedLocation={jest.fn()} loadLocations={jest.fn()} loading={false} ownLocations={[]} friendLocations={[]} setSelectedView={()=>{}}></ListOfLocations>)
    expect(getByTestId('loadingView')).toBeInTheDocument();
})
 */