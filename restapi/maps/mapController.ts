import { RequestHandler } from "express";
import { Coordinates, Location } from "../locations/Location";

export const getLocation: RequestHandler = async (req, res) => {

    const webId = req.headers.token + "";
    let coordinates : Coordinates = {lng: 1, lat:3}
    let point : Location = {
        "name": "lugar",
        coordinates : coordinates,
        description : "descripcion",
    }
    res.json(point);
    //return res.status(409).json();
}