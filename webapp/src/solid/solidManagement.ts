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

import { FOAF, VCARD, SCHEMA_INRUPT, RDF} from "@inrupt/vocab-common-rdf"


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
  let newFolderURL = `${baseURL}private/lomap/locations/index.ttl`; // locations contained in index.ttl 
  let locations: Location[] = []; // initialize array of locations
  let locationThings; 
  try {
    let dataSet = await getSolidDataset(newFolderURL, {fetch: fetch}); // get the dataset
    locationThings = getThingAll(dataSet) // get the things from the dataset
    for (let location of locationThings) { // for each location in the dataset
      let name = getStringNoLocale(location, SCHEMA_INRUPT.name) as string; 
      let longitude = getStringNoLocale(location, SCHEMA_INRUPT.longitude) as string; 
      let latitude = getStringNoLocale(location, SCHEMA_INRUPT.latitude) as string; 
      let description = getStringNoLocale(location, SCHEMA_INRUPT.description) as string; 
      let imagesFolder = getStringNoLocale(location, SCHEMA_INRUPT.URL) as string; // get the path of the images folder
      let locationImages: string [] = [];
      getLocationImage(imagesFolder).then((result) => locationImages = result) // obtain the string[] from Promise<string[]>
  
      // if location is not null, add it to the location array
      if (location)
        locations.push({
          name: name,
          coordinates : {lng: new Number(longitude), lat: new Number(latitude)},
          description: description,
          url: location,
          images: locationImages
        });
    }
  } catch (error) {
    locationThings = [];
  }
  
  return locations;
}

/**
 * Given the folder containing the images of the locations, gets the images (things) inside the dataset.
 * @param imagesFolderUrl url of the images folder
 * @returns string[] containing the images
 */
export async function getLocationImage(imagesFolderUrl:string){
  let images: string[] = [];
  let imagesThings;
  try {
    let imagesDataSet = await getSolidDataset(imagesFolderUrl, {fetch: fetch}); // get images dataset
    imagesThings = getThingAll(imagesDataSet)
    for (let image of imagesThings){
      let img = getStringNoLocale(image, SCHEMA_INRUPT.image) as string;
      images.push(img);
    }
  } catch (error){
    images = [];
  }
return images;
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
  let newFolderURL = `${baseURL}private/lomap/locations/index.ttl`;

  try {
    await addLocationToDataSet(newFolderURL, location)
  } catch (error) {
    // error because the dataset does not exist -> create it
    await createLocationDataSet(newFolderURL, location)
  }
}

export async function addLocationToDataSet(folderURL:string, location:Location){
  let baseURL = folderURL.split("private")[0];
  let locationID = location.name.trim();
  let dataSet = await getSolidDataset(folderURL, {fetch: fetch});
  let imagesURL = `${baseURL}private/lomap/images/${locationID}/index.ttl`;

  let newLocation = buildThing(createThing({name: locationID})) // give the thing a name
    .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, location.description.toString())
    .addStringNoLocale(SCHEMA_INRUPT.URL, imagesURL)
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();

  dataSet = setThing(dataSet, newLocation);
  addLocationImage(imagesURL, location);
  try {
    await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch})
  } catch (error){ 
    console.log(error)
  }
}

export async function createLocationDataSet(folderURL:string, location:Location) {
    let baseURL = folderURL.split("private")[0];
    let locationID = location.name.trim(); //location id
    let dataSet = createSolidDataset(); // create solid dataset
    let imagesURL = `${baseURL}private/lomap/images/${locationID}/index.ttl`; // create images url
    // build location thing
    let newLocation = buildThing(createThing({name: locationID})) 
    .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, location.description.toString())
    .addStringNoLocale(SCHEMA_INRUPT.URL, imagesURL)
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();


    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    addLocationImage(imagesURL, location);
    try {
      await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
}

export async function addLocationImage(url: string, location:Location) {
  let imagesDataSet = createSolidDataset();
  location.images?.forEach(async image => {
      let newImage = buildThing(createThing({name: image}))
      .addStringNoLocale(SCHEMA_INRUPT.image, image)
      .build();
      imagesDataSet = setThing(imagesDataSet, newImage);
      try {
        imagesDataSet = await saveSolidDatasetAt(url, imagesDataSet, {fetch: fetch});
      } catch (error){
        console.log(error);
      }
    }
  );
}


export async function deleteLocation(webID:string, locationUrl: string) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let locationsFolderURL = `${baseURL}private/lomap/locations/index.ttl`;
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
