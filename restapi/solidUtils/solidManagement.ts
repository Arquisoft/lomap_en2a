import type { Location } from "../locations/Location";
import { fetch } from "@inrupt/solid-client-authn-browser";


import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl, getUrlAll,
  getStringNoLocale
} from "@inrupt/solid-client";

import { VCARD } from "@inrupt/vocab-common-rdf"


// ************** FUNCTIONS *****************

// READ FUNCTIONS

export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}
export async function getLocations(webID:string) : Promise<Array<Location>> {
  
  let locationsURLs = getUrlAll(await getUserProfile(webID), VCARD.hasGeo);
  let locations: Location[] = [];

  // for each location url, get the fields of the object
  for (let location of locationsURLs) {
    let name = getStringNoLocale(
      await getUserProfile(location),
      VCARD.Name
    ) as string;
    let longitude = getStringNoLocale(
      await getUserProfile(location),
      VCARD.longitude
    ) as string;
    let latitude = getStringNoLocale(
      await getUserProfile(location),
      VCARD.latitude
    ) as string;
    let description = getStringNoLocale(
      await getUserProfile(location),
      VCARD.Text
    ) as string;

    if (location)
      locations.push({
        name: name,
        coordinates : {lng: Number(longitude), lat: Number(latitude)},
        description: description,
        url: location
      }
    );
  }
  
  return locations;

}


// WRITE FUNCTIONS

export async function createLocation(webID:string, location:Location) {
    // get the url of the full dataset
    let profile = String(webID).split("#")[0]; //just in case there is extra information in the url
    // to write to a profile you must be authenticated, that is the role of the fetch

    let dataSet = await getSolidDataset(profile, { });
    
    // We create the location
    const newLocation = buildThing(createThing())
    .addStringNoLocale(VCARD.Name, location.name.toString())
    .addStringNoLocale(VCARD.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(VCARD.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(VCARD.Text, location.description.toString())
    .addUrl(VCARD.Type, VCARD.Location)
    .build();

    // check if there exists any location
    let existLocations = await getThing(dataSet, VCARD.hasGeo) as Thing;
    // if they do not exist, create it
    if (existLocations === null){
      existLocations = buildThing(await getUserProfile(webID)).addUrl(VCARD.hasGeo, newLocation.url).build();
    }
    // add the location to the existing ones
    else{
      existLocations = buildThing(existLocations).addUrl(VCARD.hasGeo, newLocation.url).build();
    }

    // insert the new location in the dataset
    dataSet = setThing(dataSet, newLocation);
    // insert/replace the control structure in the dataset
    dataSet = setThing(dataSet, existLocations);

    return await saveSolidDatasetAt(webID, dataSet, {})
}

export async function deleteLocation(webID:string, locationUrl: string) {
  let profile = webID.split("#")[0];
  let dataset = await getSolidDataset(profile, { });

  // obtain the location from the POD
  let location = getThing(dataset, locationUrl) as Thing;
  // get the locations record and delete the desired one
  let existLocations = buildThing(await getUserProfile(webID))
    .removeUrl(VCARD.hasGeo, locationUrl)
    .build();

  // cant remove something that does not exist
  if (existLocations === null || location === null) return Promise.reject();
  // remove the location
  dataset = removeThing(dataset, location);
  // remove the location url from the record
  existLocations = removeUrl(existLocations, VCARD.hasGeo, locationUrl);
  // update the dataset
  dataset = setThing(dataset, existLocations);

  return await saveSolidDatasetAt(webID, dataset, {   });
}



export function logIn( podProvider : string){

  let solid = require("solid-auth-client")
  
  let session = solid.currentSession();
  solid.login({
    redirectUrl: "http://localhost:3000", // after redirect, come to the actual page
    oidcIssuer: podProvider, // redirect to the url
    clientName: "Lo Map", 
  });
  // let session = useSession()

  // session.login({
  //   redirectUrl: "http://localhost:3000", // after redirect, come to the actual page
  //   oidcIssuer: podProvider, // redirect to the url
  //   clientName: "Lo Map", 
  // });
}

async function popupLogin() {
  


  // let session = await solid.currentSession();
  // let popupUri = 'https://solidcommunity.net/common/popup.html';
  // if (!session)
  //   session = await solid.popupLogin({ popupUri });
  // console.log(`Logged in as ${session.webId}`);
}
popupLogin();
