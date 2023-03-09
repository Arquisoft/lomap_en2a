
import axios from 'axios';
import { useState } from 'react';
import { Location } from '../../../../../restapi/locations/Location';
import { useSession } from "@inrupt/solid-ui-react";


function CreateLocation() : JSX.Element {

    const session = useSession();
    let location : Location;

    const handleSubmit = (e) => {
        e.preventDefault(); //if not used, the page will reload and data will be lost
        
        // capture the fields values
        let locName = e.target.name.value as string;
        let locLongitude = e.target.longitude.value as string;
        let locLatitude = e.target.latitude.value as string;
        let locDescription = e.target.description.value as string;
        
        // create location object
        location = {
            name: locName,
            coordinates : {lat: Number(locLatitude), lng : Number(locLongitude)},
            description: locDescription,
            images:[]
        }
        //we send to the restapi the request to add the location
        axios.post( "http://localhost:5000/locations/add", 
                //we send the webid in the session and the location to the restapi
                {location},
                //we indicate that the content is in json format
                {headers: 
                    {
                        'Content-Type' : 'application/json',
                        "Authorization": JSON.stringify(session),
                    }
                }
            ).catch((error) =>{
                //if the request was not correct    
                //TODO show an error to the user so he/she can retry
            });
    }
    
    return(
        <form onSubmit={handleSubmit} style={{"border":"2px solid grey", "width":"30%", "margin":"auto", "padding":"20px", "borderRadius":"15px"}}>
            <p style={{"fontSize":"1.5em", "textAlign":"center", "marginTop":"0px"}}>Add a location</p>
            <label>Location name:
            <input style={{"background":"grey", "margin": "10px"}}
                type="text" 
                name="name"  
            /> <br></br>
            </label>
            <label>Location longitude:
            <input style={{"background":"grey", "margin": "10px"}}
            type="text" 
            name="longitude" 
            /><br></br>
            </label>
            <label>Location latitude:
            <input style={{"background":"grey", "margin": "10px"}}
            type="text" 
            name="latitude" 
            /><br></br>
            </label>
            <label>Location description:
            <input style={{"background":"grey", "margin": "10px"}}
            type="text" 
            name="description" 
            /><br></br>
            </label>
            <button type="submit">Add Location</button>
        </form>
    );
}

export default CreateLocation;