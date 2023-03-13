import express, { RequestHandler, Router } from "express";
import * as LocationController from "./LocationController";


const api: Router = express.Router();


api.get("/test", LocationController.test);

api.post("/add", LocationController.addLocation);

api.get("/getAll" ,(req,res) => {

    res.status(200).json([])
})

export default api;