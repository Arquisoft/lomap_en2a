import express, { RequestHandler, Router } from "express";
import axios from "axios";
const api: Router = express.Router();

const { 
  getSessionFromStorage,
  Session
} = require("@inrupt/solid-client-authn-node");




api.get("/login",async (req,res ) =>{  
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', '*');

   console.log("login")
   // 1. Create a new Session
   const session = new Session();
   req.session.id = session.info.sessionId;

   // 2. Start the login process; redirect handler will handle sending the user to their
   //    Solid Identity Provider.
   await session.login({
     // After login, the Solid Identity Provider will send the user back to the following
     // URL, with the data necessary to complete the authentication process
     // appended as query parameters:
     redirectUrl: `http://localhost:5000/login/redirect-from-solid-idp`,
     // Set to the user's Solid Identity Provider; e.g., "https://login.inrupt.com" 
     oidcIssuer: "https://inrupt.net/", //TODO fix to be the one in the request
     //name showed in the login window
     clientName: "LoMap",
     //redirection method used 
      handleRedirect: (url : string) => { 
        // axios.get(url, {
        //   headers:{
        //     'Access-Control-Allow-Origin': 'http://localhost:3000',
        //     'Access-Control-Allow-Methods': '*',
        //     'Access-Control-Allow-Headers': '*'
        //   }}).then((response)=>{console.log("axios then")})
        
        // console.log(url)
        //res.redirect(url)
         res.json(url)
      },
     
   });

});

api.get("/redirect-from-solid-idp", async (req, res) => {
  // 3. If the user is sent back to the `redirectUrl` provided in step 2,
  //    it means that the login has been initiated and can be completed. In
  //    particular, initiating the login stores the session in storage, 
  //    which means it can be retrieved as follows.
  const session = await getSessionFromStorage(req.session.id);

  console.log(req.url)
  console.log(`http://localhost:5000${req.url}`)
  // 4. With your session back from storage, you are now able to 
  //    complete the login process using the data appended to it as query
  //    parameters in req.url by the Solid Identity Provider:
  await session.handleIncomingRedirect(`http://localhost:5000${req.url}`);

  // 5. `session` now contains an authenticated Session instance.
  if (session.info.isLoggedIn) {
    console.log("todo bien")
    return res.status(200)
  }
  else{
    console.log("todo mal")
    return res.status(401) //TODO mirar que error poner aqui
  }
});

// 6. Once you are logged in, you can retrieve the session from storage, 
//    and perform authenticated fetches.
api.get("/fetch", async (req, res) => {
  if(typeof req.query["resource"] === "undefined") {
    res.send(
      //TODO sustituir por un status error
      "<p>Please pass the (encoded) URL of the Resource you want to fetch using `?resource=&lt;resource URL&gt;`.</p>"
    );
  }
  const session = await getSessionFromStorage(req.session.id);
  console.log(await (await session.fetch(req.query["resource"])).text());
  res.send("<p>Performed authenticated fetch.</p>");
});

// 7. To log out a session, just retrieve the session from storage, and 
//    call the .logout method.
api.get("/logout", async (req, res) => {
  const session = await getSessionFromStorage(req.session.id);
  session.logout();
  res.send(`<p>Logged out.</p>`);
});


export default api;