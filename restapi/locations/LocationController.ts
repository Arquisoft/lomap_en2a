import { RequestHandler } from "express";
import {Location}  from "./Location";
import { createLocation } from "../solidUtils/solidManagement";

export const test: RequestHandler = async (req, res) => {

   res.json({test: "test"})
}

export const addLocation :RequestHandler = async(req, res) => {
    let data = req.body;
    //we make use of the solid class to store information on the location
    createLocation(data.webID as string, data.location)

    res.status(200) //we return OK
}