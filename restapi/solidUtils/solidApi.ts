import express, { RequestHandler, Router } from "express";
import { logIn } from "./solidManagement";

const api: Router = express.Router();


api.post("/login",(rec,res) =>{
    let data = rec.body
    console.log("haciendo login")
    logIn(data.podProvider)

    res.status(200)
});


export default api;