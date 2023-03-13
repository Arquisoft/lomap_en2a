import type { Location } from "../../../restapi/locations/Location";
import type { Friend } from "../../../restapi/users/User";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { Session } from "@inrupt/solid-client-authn-browser";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl, getUrlAll,
  getStringNoLocale
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

export async function getLocations(webID:string) {
  
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
        coordinates : {lng: new Number(longitude), lat: new Number(latitude)},
        description: description,
        url: location
      });
  }
  
  return locations;

}

export async function getFriends(webID:string) {
  
  let friendURLs = getUrlAll(await getUserProfile(webID), VCARD.Contact);
  let friends: Friend[] = [];

  // for each location url, get the fields of the object
  for (let friend of friendURLs) {
    let name = getStringNoLocale(
      await getUserProfile(friend),
      VCARD.Name
    ) as string;
    let webId = getStringNoLocale(
      await getUserProfile(friend),
      VCARD.url
    ) as string;
    

    if (friend)
      friends.push({
        username: name,
        webID : webId
      });
  }
  
  return friends;

}


// WRITE FUNCTIONS

export async function createLocation(webID:string, location:Location) {
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // to write to a profile you must be authenticated, that is the role of the fetch
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
    
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

    console.log("creando localiz")
    console.log(location)

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

export async function addFriend(webID:string, friend:Friend) {
  // get the url of the full dataset
  let profile = webID.split("#")[0]; //just in case there is extra information in the url
  // to write to a profile you must be authenticated, that is the role of the fetch
  let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
  
  // We create the location
  const newLocation = buildThing(createThing())
  .addStringNoLocale(VCARD.Name, friend.username.toString())
  .addStringNoLocale(VCARD.url, friend.webID.toString())
  .addUrl(VCARD.Type, VCARD.Friend)
  .build();

  // check if there exists any 
  let existLocations = await getThing(dataSet, VCARD.Contact) as Thing;
  // if they do not exist, create it
  if (existLocations === null){
    const friends  = await getFriends(webID).then(friendsPromise => {return friendsPromise});
    console.log(friends);
    if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
      console.log("The value is present");
    }
    else{

      existLocations = buildThing(existLocations).addUrl(VCARD.Contact, newLocation.url).build();
    }
    existLocations = buildThing(await getUserProfile(webID)).addUrl(VCARD.Contact, newLocation.url).build();
  }
  // add the location to the existing ones
  else{
    const friends  = await getFriends(webID).then(friendsPromise => {return friendsPromise});
    console.log(friends);
    if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
      console.log("The value is present");
    }
    else{

      existLocations = buildThing(existLocations).addUrl(VCARD.Contact, newLocation.url).build();
    }
  }

  // insert the new location in the dataset
  dataSet = setThing(dataSet, newLocation);
  // insert/replace the control structure in the dataset
  dataSet = setThing(dataSet, existLocations);

  console.log("adding friend")

  return await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
}