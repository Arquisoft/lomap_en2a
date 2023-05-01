import React from 'react'
import { render } from "@testing-library/react";
import FriendsDetail from "../components/friends/FriendsDetail";
import type { Friend } from "../types/types";

test('check username renders correctly',async () => {
    let user : Friend = {username:String("username"), webID:String("webID"), pfp:""}
    const {getByText}= render(<FriendsDetail friend={user} key={1}></FriendsDetail>)
    expect(getByText(user.username as string)).toBeInTheDocument();
})

test('check image renders correctly',async () => {
    let user : Friend = {username:String("username"), webID:String("webID"), pfp:""}
    const {getByTestId}= render(<FriendsDetail friend={user} key={1}></FriendsDetail>)
    expect(getByTestId("friendImage")).toBeInTheDocument();
})


test('check webID renders correctly',async () => {
    let user : Friend = {username:String("username"), webID:String("webID"), pfp:""}
    const {getByText}= render(<FriendsDetail friend={user} key={1}></FriendsDetail>)
    expect(getByText(user.webID as string)).toBeInTheDocument();
})