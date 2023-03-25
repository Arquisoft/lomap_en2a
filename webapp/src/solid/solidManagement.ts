import type { Location } from "../../../restapi/locations/Location";
import type { Friend } from "../../../restapi/users/User";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { Session } from "@inrupt/solid-client-authn-browser";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  removeUrl, getUrlAll,
  getStringNoLocale,
  createContainerAt,
  createSolidDataset
} from "@inrupt/solid-client";

import { FOAF, VCARD , RDF} from "@inrupt/vocab-common-rdf"

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

export async function getNameFromPod(webID: string){
  if (webID === "" || webID === undefined) return "Name not found";
  let name = getStringNoLocale(await getUserProfile(webID), FOAF.name);
  return name !== null ? name : "John Doe";
}

export async function getLocations(webID:string) {
    let baseURL = webID.split("#")[0]; // url of the type https://<nombre>.inrupt.net/profile/
    // create a LoMap folder inside of this url to store LoMap related information
    let newFolderURL = `${baseURL}/lomap/locations/`;
  
  // get all the locations (has Geo)
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

    // if location is not null, add it to the return array
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
  let newFolderURL = `${baseURL}public/lomap/locations/`;
  try {
    await addLocationToDataSet(newFolderURL, location)
  } catch (error) {
    await createLocationDataSet(newFolderURL, location)
  }
}

export async function addLocationToDataSet(folderURL:string, location:Location){
  let locationID = location.name.trim();
  let dataSet = await getSolidDataset(folderURL, {fetch: session.fetch});

  let newLocation = buildThing(createThing({name: locationID})) // give the thing a name
    .addStringNoLocale(VCARD.Name, location.name.toString())
    .addStringNoLocale(VCARD.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(VCARD.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(VCARD.Text, location.description.toString())
    .addUrl(VCARD.Type, VCARD.Location)
    .build();

  dataSet = setThing(dataSet, newLocation);
  await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch})
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
    await saveSolidDatasetAt(folderURL, dataSet, {fetch: session.fetch}) // save dataset
}

// export async function createLocationJ(webID:string, location:Location) {
//   // make the folder for the location
    

//     let locationsDataSet;
    
//     // get dataset if it exists
//     try {
//       locationsDataSet = await getSolidDataset(locationsURL, {fetch: session.fetch});
//     } catch (error){
//       locationsDataSet = createSolidDataset();
//     }

//     let name = location.name.trim() // remove blank spaces

//     // We create the location
//     const newLocation = buildThing(createThing({name: name})) // give the thing a name
//     .addStringNoLocale(VCARD.Name, location.name.toString())
//     .addStringNoLocale(VCARD.longitude, location.coordinates.lng.toString())
//     .addStringNoLocale(VCARD.latitude, location.coordinates.lat.toString())
//     .addStringNoLocale(VCARD.Text, location.description.toString())
//     .addUrl(VCARD.Type, VCARD.Location)
//     .build();

//     // insert the new location in the dataset
//     locationsDataSet = setThing(locationsDataSet, newLocation);
//     try {
//       locationsDataSet = await saveSolidDatasetAt(locationsURL, locationsDataSet, {fetch: fetch})
//     } catch (error) {
//         console.log(error)
//     }
    
//     return locationsDataSet;
// }

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

export async function addFriend(webID:string, friend:Friend): Promise<{ error: boolean, errorMessage: string }> {
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // to write to a profile you must be authenticated, that is the role of the fetch
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
  

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
