import express, { Application, RequestHandler } from "express";
import cors from 'cors';
import bp from 'body-parser';
import promBundle from 'express-prom-bundle';
import apiSolid from "./solidUtils/solidApi"

import apiLocations from "./locations/locationRoutes"

const cookieSession = require("cookie-session");

const app: Application = express();
const port: number = 5000;


// The following snippet ensures that the server identifies each user's session
// with a cookie using an express-specific mechanism
app.use(
    cookieSession({
      name: "session",
      // These keys are required by cookie-session to sign the cookies.
      keys: [
        "Required, but value not relevant for this demo - key1",
        "Required, but value not relevant for this demo - key2",
      ],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    })
  );


  
// app.use((req,res,next)=>{
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');
// })


const metricsMiddleware:RequestHandler = promBundle({includeMethod: true});
app.use(metricsMiddleware);

app.use(cors());
app.use(bp.json());

app.use("/locations",apiLocations)
app.use("/login",apiSolid)

app.listen(port, ():void => {
    console.log('\n--------------------------------\nRestapi listening on '+ port+'\n--------------------------------\n');
}).on("error",(error:Error)=>{
    console.error('Error occured: ' + error.message);
});

