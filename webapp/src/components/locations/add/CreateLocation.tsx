import { useSession } from '@inrupt/solid-ui-react';
import { useState } from 'react';
import { createLocation } from '../../../solid/solidManagement';
import { Location } from '../../../types/types';


function CreateLocation() : JSX.Element {

    const session = useSession();
    let location : Location;

    const [name, setName] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault(); //if not used, the page will reload and data will be lost
        
        // capture the fields values
        let locName = e.target.name.value as string;
        let locLongitude = e.target.longitude.value as string;
        let locLatitude = e.target.latitude.value as string;
        let locDescription = e.target.description.value as string;

        // update the values
        setName(locName);
        setLongitude(locLongitude);
        setLatitude(locLatitude);
        setDescription(locDescription);
        
        // create location object
        location = {
            name: name.toString(),
            longitude: longitude.toString(),
            latitude: latitude.toString(),
            description: description.toString()
        }
        createLocation(session.session.info.webId as string, location)
    }
    
    return(
        <form onSubmit={handleSubmit} style={{"border":"2px solid grey", "width":"30%", "margin":"auto", "padding":"20px", "borderRadius":"15px"}}>
            <p style={{"fontSize":"1.5em", "textAlign":"center", "marginTop":"0px"}}>Add a location</p>
            <label>Location name:
            <input style={{"margin": "10px"}}
                type="text" 
                name="name"  
            /> <br></br>
            </label>
            <label>Location longitude:
            <input style={{"margin": "10px"}}
            type="text" 
            name="longitude" 
            /><br></br>
            </label>
            <label>Location latitude:
            <input style={{"margin": "10px"}}
            type="text" 
            name="latitude" 
            /><br></br>
            </label>
            <label>Location description:
            <input style={{"margin": "10px"}}
            type="text" 
            name="description" 
            /><br></br>
            </label>
            <button type="submit">Add Location</button>
        </form>
    );
}

export default CreateLocation;