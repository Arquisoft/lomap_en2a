import express, { RequestHandler, Router } from "express";
import * as LocationController from "../locations/LocationController";

const api: Router = express.Router();


api.get("/list", LocationController.getLocation);
api.get("/test", (req, res) => {
    res.json({name:"test",longitude:0 , latitude:4, description:"esto es una descripcion"});
});

export default api;