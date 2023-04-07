import React from 'react'
import { render } from "@testing-library/react";
import Review from "./Review";

test('check username displays correctly',async () => {
    const {getByText}= render(<Review username='testUsrname' content='Body review' date={new Date('1/1/2000')} title='testTitle'></Review>)
    expect(getByText('testUsrname')).toBeInTheDocument();
})

test('check title displays correctly',async () => {
    const {getByText}= render(<Review username='testUsrname' content='Body review' date={new Date('1/1/2000')} title='testTitle'></Review>)
    expect(getByText('testTitle')).toBeInTheDocument();
})

test('check content displays correctly',async () => {
    const {getByText}= render(<Review username='testUsrname' content='Body review' date={new Date('1/1/2000')} title='testTitle'></Review>)
    expect(getByText('Body review')).toBeInTheDocument();
})

test('check date displays correctly',async () => {
    const {getByText}= render(<Review username='testUsrname' content='Body review' date={new Date('1/1/2000')} title='testTitle'></Review>)
    expect(getByText('1/1/2000, 0:00:00')).toBeInTheDocument();
})

