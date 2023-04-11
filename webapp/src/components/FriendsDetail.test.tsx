import React from 'react'
import { render } from "@testing-library/react";
import FriendsDetail from "./FriendsDetail";
import { Friend } from '../../../restapi/users/User';

test('check username renders correctly',async () => {
    let user : Friend = {username:String("username"), webID:String("webID")}
    const {getByText}= render(<FriendsDetail friend={user} key={1}></FriendsDetail>)
    expect(getByText(user.username as string)).toBeInTheDocument();
})
