import { RequestHandler } from "express";
import { hasUncaughtExceptionCaptureCallback } from "process";
import {Location}  from "./Location";

export const getLocation: RequestHandler = async (req, res) => {

    // const webId = req.headers.token + "";
    
    // let location : Location = {
    //     name: "hola",
    //     longitude : 2,
    //     latitude : 2,
    //     description : "des"
    // };
    // res.json(location);
}