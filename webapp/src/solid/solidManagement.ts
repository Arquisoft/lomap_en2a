import type { Location } from "../types/types";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { Session } from "@inrupt/solid-client-authn-browser";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl
} from "@inrupt/solid-client";

import { VCARD } from "@inrupt/vocab-common-rdf"

const session = new Session();


// ************** FUNCTIONS *****************

// READ FUNCTIONS

export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}


// WRITE FUNCTIONS

export async function createLocation(webID:string, location:Location) {
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // to write to a profile you must be authenticated, that is the role of the fetch
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
    
    // We create the location
    const newLocation = buildThing(createThing())
    .addStringNoLocale(VCARD.Name, location.name)
    .addStringNoLocale(VCARD.longitude, location.longitude)
    .addStringNoLocale(VCARD.latitude, location.latitude)
    .addStringNoLocale(VCARD.Text, location.description)
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

    return await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
}

export async function deleteLocation(webID:string, locationUrl: string) {
  let profile = webID.split("#")[0];
  let dataset = await getSolidDataset(profile, {fetch: session.fetch});

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

  return await saveSolidDatasetAt(webID, dataset, { fetch: fetch });
}
