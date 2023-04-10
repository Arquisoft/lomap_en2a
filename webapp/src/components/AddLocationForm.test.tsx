import React from 'react'
import { act, fireEvent, render } from "@testing-library/react";
import AddLocationForm from "./AddLocationForm";


test('',async () => {
    const {container}= render(<AddLocationForm onSubmit={jest.fn()} key={1}></AddLocationForm>)
    expect(container.querySelector('img')).toBeInTheDocument();
})
