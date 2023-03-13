import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle'; 

import apiLocations from "./locations/locationRoutes"

const app: Application = express();
const port: number = 5000;

const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/locations",apiLocations)

app.listen(port, ():void => {
    console.log('Restapi listening on '+ port);
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});

