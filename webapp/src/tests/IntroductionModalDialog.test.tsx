import React from 'react'
import { render } from "@testing-library/react";
import {IntroductionModalDialog} from "../components/dialogs/IntroductionModalDialog";
import type { Friend } from "../types/types";

test('check username renders correctly',async () => {
    
    const {getByText}= render(<IntroductionModalDialog></IntroductionModalDialog>)
    expect(getByText("Welcome to LoMap!")).toBeInTheDocument();
})

