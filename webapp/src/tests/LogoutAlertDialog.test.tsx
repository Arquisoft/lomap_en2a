import React from 'react'
import { render } from "@testing-library/react";
import { LogoutAlertDialog } from '../components/dialogs/LogoutAlertDialog';
import userEvent from '@testing-library/user-event';

test('check component displays correctly',async () => {
    const {getByTestId}= render(<LogoutAlertDialog/>);
    expect(getByTestId('logout')).toBeInTheDocument();
})


test('Click logout',async () => {
    const {getByTestId}= render(<LogoutAlertDialog/>);
    expect(getByTestId('logout')).toBeInTheDocument();
    const b = getByTestId('logout');
    userEvent.click(b);
    expect(getByTestId('info-dialog')).toBeInTheDocument();
    const c = getByTestId('logout-button');
    expect(getByTestId('logout-button')).toBeInTheDocument();
    userEvent.click(c);
})