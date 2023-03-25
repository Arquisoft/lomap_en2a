import type { Location } from "../../../restapi/locations/Location";
import type { Friend } from "../../../restapi/users/User";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getThingAll } from "@inrupt/solid-client";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl, getUrlAll,
  getStringNoLocale,
  createContainerAt,
  createSolidDataset
} from "@inrupt/solid-client";

import { FOAF, VCARD , RDF} from "@inrupt/vocab-common-rdf"

// const session = new Session();


// ************** FUNCTIONS *****************

// READ FUNCTIONS

export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}

export async function getNameFromPod(webID: string){
  if (webID === "" || webID === undefined) return "Name not found";
  let name = getStringNoLocale(await getUserProfile(webID), FOAF.name);
  return name !== null ? name : "John Doe";
}

export async function getLocations(webID:string) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.provider/
  let newFolderURL = `${baseURL}public/lomap/locations/index.ttl`;
  let locations: Location[] = [];
  let locationThings;
  try {
    let dataSet = await getSolidDataset(newFolderURL, {fetch: fetch});
    locationThings = getThingAll(dataSet)
    for (let location of locationThings) {
      let name = getStringNoLocale(location, VCARD.Name) as string;
      let longitude = getStringNoLocale(location, VCARD.longitude) as string;
      let latitude = getStringNoLocale(location, VCARD.latitude) as string;
      let description = getStringNoLocale(location, VCARD.Text) as string;
  
      // if location is not null, add it to the return array
      if (location)
        locations.push({
          name: name,
          coordinates : {lng: new Number(longitude), lat: new Number(latitude)},
          description: description,
          url: location
        });
    }
  } catch (error) {
    locationThings = [];
  }
  
  return locations;
}

export async function getFriends(webID:string) {
  
  let friendURLs = getUrlAll(await getUserProfile(webID), VCARD.Contact);
  let friends: Friend[] = [];

  // for each friend url, get the fields of the object
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
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let newFolderURL = `${baseURL}public/lomap/locations/index.ttl`;
  try {
    await addLocationToDataSet(newFolderURL, location)
  } catch (error) {
    await createLocationDataSet(newFolderURL, location)
  }
}

export async function addLocationToDataSet(folderURL:string, location:Location){
  let locationID = location.name.trim();
  let dataSet = await getSolidDataset(folderURL, {fetch: fetch});

  let newLocation = buildThing(createThing({name: locationID})) // give the thing a name
    .addStringNoLocale(VCARD.Name, location.name.toString())
    .addStringNoLocale(VCARD.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(VCARD.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(VCARD.Text, location.description.toString())
    .addUrl(VCARD.Type, VCARD.Location)
    .build();

  dataSet = setThing(dataSet, newLocation);
  try {
    await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch})
  } catch (error){
    console.log(error)
  }
}

export async function createLocationDataSet(folderURL:string, location:Location) {
    let locationID = location.name.trim(); //location id
    let dataSet = createSolidDataset(); // create solid dataset
    // build location thing
    let newLocation = buildThing(createThing({name: locationID})) 
    .addStringNoLocale(VCARD.Name, location.name.toString())
    .addStringNoLocale(VCARD.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(VCARD.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(VCARD.Text, location.description.toString())
    .addUrl(VCARD.Type, VCARD.Location)
    .build();

    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    try {
      await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
}

export async function deleteLocation(webID:string, locationUrl: string) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let locationsFolderURL = `${baseURL}public/lomap/locations/`;
  try {
    let dataSet = await getSolidDataset(locationsFolderURL, {fetch: fetch}); // fetch locations dataset
    // obtain the location from the POD
    let location = getThing(dataSet, locationUrl) as Thing;

    // cant remove something that does not exist
    if (location === null) return Promise.reject();
    // remove the location
    dataSet = removeThing(dataSet, location);
    
    // update the dataset
    return await saveSolidDatasetAt(locationsFolderURL, dataSet, { fetch: fetch });
  } catch (error) {
    return Promise.reject()
  }
}

export async function addFriend(webID:string, friend:Friend): Promise<{ error: boolean, errorMessage: string }> {
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // to write to a profile you must be authenticated, that is the role of the fetch
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
  

    // We create the location
    const newFriend = buildThing(createThing())
    .addStringNoLocale(VCARD.Name, friend.username.toString())
    .addStringNoLocale(VCARD.url, friend.webID.toString())
    .addUrl(VCARD.Type, VCARD.Friend)
    .build();
  
    // check if there exists any 
    let existFriends = await getThing(dataSet, VCARD.Contact) as Thing;
    // if they do not exist, create it
    if (existFriends === null){
      const friends  = await getFriends(webID).then(friendsPromise => {return friendsPromise});
      console.log(friends);
      if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
        console.log("The value is present");
        return {error:true,errorMessage:"You are already friends"};
      }
      else{
  
        //existFriends = buildThing(existFriends).addUrl(VCARD.Contact, newFriend.url).build();
      }
      existFriends = buildThing(await getUserProfile(webID)).addUrl(VCARD.Contact, newFriend.url).build();

    }
    // add the location to the existing ones
    else{

      const friends  = await getFriends(webID).then(friendsPromise => {return friendsPromise});
      console.log(friends);
      if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
        console.log("The value is present");
        return{error:true,errorMessage:""};
      }
      else{
  
        existFriends = buildThing(existFriends).addUrl(VCARD.Contact, newFriend.url).build();
      }
    }
  
    // insert the new location in the dataset
    dataSet = setThing(dataSet, newFriend);
    // insert/replace the control structure in the dataset
    dataSet = setThing(dataSet, existFriends);
  
    console.log("adding friend")
  
    await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
    return{error:false,errorMessage:""}

}
