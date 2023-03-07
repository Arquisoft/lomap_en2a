import express, { RequestHandler, Router } from "express";
import { Location } from "./Location";
import * as LocationController from "./LocationController";

const api: Router = express.Router();


api.get("/list", LocationController.getLocation);
api.get("/test", (req, res) => {
    //res.json({name:"test",lng:0 , lat:4, description:"esto es una descripcion"});
});

api.get("/getAll" ,(req,res) => {

    //res.json(locations);
})

export default api;