import { RequestHandler } from "express";
import { Location } from "./location";

export const getLocation: RequestHandler = async (req, res) => {

    const webId = req.headers.token + "";
    let point = new Location("prueba",1,1,"descripcion");
    res.json(point);
    //return res.status(409).json();
}