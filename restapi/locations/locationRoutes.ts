import express, { RequestHandler, Router } from "express";
import { Location } from "./Location";
import * as LocationController from "./LocationController";

const api: Router = express.Router();


api.get("/list", LocationController.getLocation);
api.get("/test", (req, res) => {
    //res.json({name:"test",lng:0 , lat:4, description:"esto es una descripcion"});
});

api.get("/getAll" ,(req,res) => {
    console.log("Request done to the restapi")
    var locations : Array<Location> = [
      {
        name: 'Statue of Liberty',
        coordinates: {
          lat: 40.6892,
          lng: -74.0445,
        },
        description: 'Iconic statue on Liberty Island',
      },
      {
        name: 'Golden Gate Bridge',
        coordinates: {
          lat: 37.8199,
          lng: -122.4783,
        },
        description: 'Iconic suspension bridge in San Francisco',
  
      },
      {
        name: 'Disneyland',
        coordinates: {
          lat: 33.8121,
          lng: -117.9190,
        },
        description: 'Popular theme park with various attractions',
      },
      {
        name: 'Machu Picchu',
        coordinates: {
          lat: -13.1631,
          lng: -72.5450,
        },
        description: 'Inca citadel in the Andes mountains',
  
      },
      {
        name: 'Taj Mahal',
        coordinates: {
          lat: 27.1750,
          lng: 78.0422,
        },
        description: 'Iconic mausoleum in Agra, India',
      },
      {
        name: 'Great Wall of China',
        coordinates: {
          lat: 40.4319,
          lng: 116.5704,
        },
        description: 'Ancient wall spanning thousands of miles',
      },
      {
        name: 'Sydney Opera House',
        coordinates: {
          lat: -33.8568,
          lng: 151.2153,
        },
        description: 'Iconic performing arts venue in Sydney',
        
      },
      {
        name: 'Serengeti National Park',
        coordinates: {
          lat: -2.3329,
          lng: 34.8605,
        },
        description: 'Vast wildlife preserve in Tanzania',
      },
      {
        name: 'Venice',
        coordinates: {
          lat: 45.4408,
          lng: 12.3155,
        },
        description: 'City of canals and historic architecture',
        
      },
      {
        name: 'Santorini',
        coordinates: {
          lat: 36.3932,
          lng: 25.4615
        },
        description: 'Gorgeous island with stunning views and architecture',
      },
    ];

    res.json(locations);
})

export default api;