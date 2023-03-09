import express, { RequestHandler, Router } from "express";


const { login, fetch } = require('solid-auth-client');
const api: Router = express.Router();

//import session from "express-session"



api.post("/login",async (req,res) =>{  //---------------------------------------- ESTO IGUAL NO SE USA //TODO
  let session;
  let authToken;
  if(req.headers.authorization){
    authToken = req.headers["authorization"].split(' ')[1]; // Extract the token from the Authorization header
    session = {accessToken: authToken};
  }
  else{
    res.status(500).json({error : "the auth token was not send"})
    return
  }

  // Use the authentication token to make requests to the SOLID server's API
  const response = await fetch('http://localhost:5000/login/login', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  // Handle the response from the SOLID server's API
  const data = await response.json();
  res.send(data);

});


export default api;