import { RequestHandler } from "express";
import {Location}  from "./Location";
import { createLocation } from "../solidUtils/solidManagement";
import { json } from "body-parser";

export const test: RequestHandler = async (req, res) => {

   res.json({test: "test"})
}


export const addLocation :RequestHandler = async(req, res) => {
    let data = req.body;
    if(req.headers.authorization ){
        // console.log(req.headers.authorization);
        // console.log(JSON.stringify(JSON.parse(req.headers.authorization )))

        createLocation(req.headers.authorization , data.location)
    }
    //console.log(data)
    //we make use of the solid class to store information on the location
    

    res.status(200) //we return OK
}