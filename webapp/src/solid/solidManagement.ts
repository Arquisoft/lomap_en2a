import type { Location } from "../../../restapi/locations/Location";
import type { Friend } from "../../../restapi/users/User";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getThingAll } from "@inrupt/solid-client";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  getUrlAll,
  getStringNoLocale,
  createSolidDataset
} from "@inrupt/solid-client";

import { FOAF, VCARD, SCHEMA_INRUPT, RDF} from "@inrupt/vocab-common-rdf"


// ************** FUNCTIONS *****************

// READ FUNCTIONS

/**
 * Get the user profile dataset from the pod
 * @param webID contains the user webID
 * @returns dataset as thing
 */
export async function getUserProfile(webID: string) : Promise<Thing>{
    // get the url of the full dataset
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    // get the dataset from the url
    let dataSet = await getSolidDataset(profile, {fetch: fetch});
    // return the dataset as a thing
    return getThing(dataSet, webID) as Thing;
}

/**
 * Get name of the user from the pod
 * @param webID contains the user webID
 * @returns name as string or 'John Doe' if unidentified
 */
export async function getNameFromPod(webID: string){
  if (webID === "" || webID === undefined) return "Name not found";
  let name = getStringNoLocale(await getUserProfile(webID), FOAF.name);
  return name !== null ? name : "John Doe";
}

/**
 * Get all the locations from the pod
 * @param webID 
 * @returns 
 */
export async function getLocations(webID:string) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.provider/
  let newFolderURL = `${baseURL}private/lomap/locations/index.ttl`; // locations contained in index.ttl 
  let locations: Location[] = []; // initialize array of locations
  let locationThings; 
  try {
    let dataSet = await getSolidDataset(newFolderURL, {fetch: fetch}); // get the locations dataset
    locationThings = getThingAll(dataSet) // get the things from the dataset
    for (let location of locationThings) { // for each location in the dataset
      let name = getStringNoLocale(location, SCHEMA_INRUPT.name) as string; 
      let longitude = getStringNoLocale(location, SCHEMA_INRUPT.longitude) as string; 
      let latitude = getStringNoLocale(location, SCHEMA_INRUPT.latitude) as string; 
      let description = getStringNoLocale(location, SCHEMA_INRUPT.description) as string; 
      let imagesFolder = getStringNoLocale(location, SCHEMA_INRUPT.URL) as string; // get the path of the images folder
      let locationImages: string [] = []; // initialize array to store the images as strings
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
    // if the location dataset does no exist, return empty array of locations
    locations = [];
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
    imagesThings = getThingAll(imagesDataSet) // get all the things in the images dataset
    for (let image of imagesThings){
      let img = getStringNoLocale(image, SCHEMA_INRUPT.image) as string; // get the path of the folder
      images.push(img);
    }
  } catch (error){
    // if the dataset does not exist, return empty array of images
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

/**
 * Create (or add) location in pod
 * @param webID contains the user webID
 * @param location contains the location to be added
 */
export async function createLocation(webID:string, location:Location) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let newFolderURL = `${baseURL}private/lomap/locations/index.ttl`; // store locations in private folder

  try {
    await addLocationToDataSet(newFolderURL, location)
  } catch (error) {
    // error because the dataset does not exist -> create it
    await createLocationDataSet(newFolderURL, location)
  }
}

/**
 * Add location to dataset
 * @param folderURL contains the path of the folder to store the location
 * @param location contains the location
 */
export async function addLocationToDataSet(folderURL:string, location:Location){
  let baseURL = folderURL.split("private")[0]; // take the www.<nombre>.provider/ to store the image folder
  let locationID = location.name.trim(); // ID of the location
  let dataSet = await getSolidDataset(folderURL, {fetch: fetch}); // get the locations dataset
  let imagesURL = `${baseURL}private/lomap/images/${locationID}/index.ttl`; // create the image folder path

  let newLocation = buildThing(createThing({name: locationID})) // give the thing a name
    .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
    .addStringNoLocale(SCHEMA_INRUPT.longitude, location.coordinates.lng.toString())
    .addStringNoLocale(SCHEMA_INRUPT.latitude, location.coordinates.lat.toString())
    .addStringNoLocale(SCHEMA_INRUPT.description, location.description.toString())
    .addStringNoLocale(SCHEMA_INRUPT.URL, imagesURL) // store the image path
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();

  dataSet = setThing(dataSet, newLocation);
  addLocationImage(imagesURL, location); // add the images of the location
  try {
    await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch})
  } catch (error){ 
    console.log(error)
  }
}

/**
 * Create the location in the given folder
 * @param folderURL contains the folder to store the location
 * @param location contains the location to be created
 */
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
    .addStringNoLocale(SCHEMA_INRUPT.URL, imagesURL) // add image folder path
    .addUrl(RDF.type, "https://schema.org/Place")
    .build();


    dataSet = setThing(dataSet, newLocation); // store thing in dataset
    addLocationImage(imagesURL, location); // store the images
    try {
      await saveSolidDatasetAt(folderURL, dataSet, {fetch: fetch}) // save dataset 
    } catch (error) {
      console.log(error)
    }
}

/**
 * Add the location images to the given folder
 * @param url contains the folder of the images
 * @param location contains the location
 */
export async function addLocationImage(url: string, location:Location) {
  let imagesDataSet = createSolidDataset(); // create dataset to store the images
  location.images?.forEach(async image => { // for each image of the location, build a thing and store it in dataset
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
