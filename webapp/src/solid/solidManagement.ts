import type { Friend, Location as LocationType, Review as ReviewType } from "../types/types";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { overwriteFile, getSourceUrl,getFile,isRawData, getContentType } from "@inrupt/solid-client";

import {
  getSolidDatasetWithAcl,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  setAgentResourceAccess,
  saveAclFor,
} from "@inrupt/solid-client";

// Friends second iteration
import { Friends } from 'solid-auth-client';

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, getThingAll,
  getUrlAll, getUrl,
  getStringNoLocale,
  createSolidDataset, deleteSolidDataset
} from "@inrupt/solid-client";
import { Category, deserializeCategories, serializeCategories } from "../components/Category";
import { DatasetContext } from "@inrupt/solid-ui-react";

import { FOAF, VCARD, SCHEMA_INRUPT, RDF} from "@inrupt/vocab-common-rdf"

import {v4 as uuid} from "uuid" // for the uuids of the locations

// ****************************************
/*
=== POD STRUCTURE ===
At this moment, the structure of the information stored in the pod sticks to the following architecture:
+ All the information belonging to LoMap is stored in the private folder of the user's pod, more precisely in
  private/lomap.
+ A dataset for each location was created to ease the manipulation of data and the granting of the access
  to some locations (friends logic). This datasets are contained in private/lomap/locations/{locationId}/index.ttl
  This dataset contains:
    # The location Thing itselft (name, description, longitude, latitude ...)
    # Things representing the images of the location
    # Things representing the reviews of the location
    # Things representing the ratings of the location.
+ Apart from that folder hierarchy, another one is needed to register the locations. If this was not done, we would have
  to iterate through all the folders of the locations directory in order to retrieve all of them. Since we did not 
  find an efficient way of doing this, we keep a locations record, which stores the location path for each one of them.
  This record is stored in /private/lomap/inventory/index.ttl

  TREE REPRESENTATION 
  - private
    - lomap
      - locations
        - LOC_ID1
          - location Thing
          - images Things
          - reviews Things
          - scores Things
        - LOC_ID2
          - . . .
        - . . .
      - inventory
        - LOC_ID1 path (private/lomap/locations/LOC_ID1)
        - LOC_ID2 path (private/lomap/locations/LOC_ID2)
        - . . .
*/



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
  let name = getStringNoLocale(await getUserProfile(webID), FOAF.name); // get the name from the profile
  return name !== null ? name : "John Doe"; // if name is not defined, return default name
}

export async function getLocation(locationPath): Promise<LocationType |null>{
  try{
    let path = getStringNoLocale(locationPath, SCHEMA_INRUPT.identifier) as string;
    let location = await getLocationFromDataset(path)
    return location;
  }catch(error){
    return null;
  }
}

/**
 * Get all the locations from the pod
 * @param webID contains the user webID
 * @returns array of locations
 */
export async function getLocations(webID:string) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombreusuario>.provider/
  let inventoryFolder = `${baseURL}private/lomap/inventory/index.ttl`; // locations contained in index.ttl 
  let locations: LocationType[] = []; // initialize array of locations
  let locationPaths; 
  try{
    let dataSet = await getSolidDataset(inventoryFolder, {fetch: fetch}); // get the inventory dataset
    locationPaths = getThingAll(dataSet) // get the things from the dataset (location paths)
    const requests = locationPaths.map(locationPath => getLocation(locationPath));
    
    const results = await Promise.allSettled(requests);
    const successfulResults = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.status === 'fulfilled' ? result.value : null)
    .filter(value => value !== null) as LocationType[];
    return successfulResults;
  }catch(error){
    let successfulResults = [];
    return successfulResults;
  }
  
}



/**
 * Retrieve the location from its dataset
 * @param locationPath contains the path of the location dataset
 * @returns location object
 */
export async function getLocationFromDataset(locationPath:string){
  let datasetPath = locationPath.split('#')[0] // get until index.ttl
  let locationDataset = await getSolidDataset(datasetPath, {fetch: fetch}) // get the whole dataset
  let locationAsThing = getThing(locationDataset, locationPath) as Thing; // get the location as thing
  let imagesUrl = datasetPath.slice(0,-9)+"images";//WORKING
  // retrieve location information
  let name = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.name) as string; 
  let longitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.longitude) as string; 
  let latitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.latitude) as string; 
  let description = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.description) as string; 
  let url = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.identifier) as string;
  let categoriesSerialized = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.Product) as string;
  let categoriesDeserialized;

  // if the location has a category assigned:
  if (categoriesSerialized) {
    // deserialize categories and obtain string[]
    categoriesDeserialized = deserializeCategories(categoriesSerialized);
  }
  else{
    categoriesDeserialized = deserializeCategories(Category.Other)
  }
  
  let locationImages: string [] = []; // initialize array to store the images as strings
  locationImages = await getLocationImage(imagesUrl); // get the images
  let reviews: ReviewType[] = []; // initialize array to store the reviews
  reviews = await getLocationReviews(datasetPath) // get the reviews
  let scores : Map<string, number>; // map to store the ratings
  scores = await getLocationScores(datasetPath); // get the ratings

  // create Location object
  let location : LocationType = {
      name: name,
      coordinates : {lng: new Number(longitude), lat: new Number(latitude)},
      description: description,
      url: url,
      category: categoriesDeserialized,
      images: locationImages,
      reviews: reviews,
      ratings: scores
  }
  return location;
}

/**
 * Get the reviews of a location
 * @param folder contains the dataset containing the reviews
 * @returns array of reviews
 */
export async function getLocationReviews(folder:string) {
  let reviews : ReviewType[] = [];
  try {
    let dataSet = await getSolidDataset(folder, {fetch:fetch}); // get dataset
    // get all things in the dataset of type review
    let things = getThingAll(dataSet).filter((thing) => getUrl(thing, VCARD.Type) === VCARD.hasNote)
    // for each review, create it and add it to the array
    for (let review of things) {
      // get review information
      let title = getStringNoLocale(review, SCHEMA_INRUPT.name) as string;
      let content = getStringNoLocale(review, SCHEMA_INRUPT.description) as string;
      let date = new Date(getStringNoLocale(review, SCHEMA_INRUPT.startDate) as string);
      let webId = getStringNoLocale(review, SCHEMA_INRUPT.Person) as string;
      let name = getStringNoLocale(await getUserProfile(webId),FOAF.name) as string;

      let newReview : ReviewType = {
        title: title,
        content: content,
        date: date,
        webId: webId,
        username: name
      }

      reviews.push(newReview);
    }

  } catch (error) {
    // if there are any errors, retrieve empty array of reviews
    reviews = [];
  }
  return reviews;
}

/**
 * Get the scores of a location
 * @param folder contains the dataset containing the scores
 * @returns Map containing the scores and their creator
 */
export async function getLocationScores(folder:string) {
  let scores : Map<string,number> = new Map<string,number>(); 
  try {
    let dataSet = await getSolidDataset(folder, {fetch:fetch}); // get the whole dataset
    // get things of type score
    let things = getThingAll(dataSet).filter((thing) => getUrl(thing, VCARD.Type) === VCARD.hasValue)
    // for each score, create it and add it to the map
    for (let score of things) {
      let value = parseInt(getStringNoLocale(score, SCHEMA_INRUPT.value) as string);
      let webId = getStringNoLocale(score, SCHEMA_INRUPT.Person) as string;

      scores.set(webId, value);
    }

  } catch (error) {
    scores = new Map<string, number>(); // retrieve empty map
  }
  return scores;
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
      try{
      const file = await getFile(
        image.url,               // File in Pod to Read
        { fetch: fetch }       // fetch from authenticated session
      );
      if(isRawData(file)){//If it's a file(not dataset)
        images.push(URL.createObjectURL(file));//Creates the file as URL and pushes it to the
      }
    }catch(e){

    }
  
      
      }
  } catch (error){
    // if the dataset does not exist, return empty array of images
    images = [];
  }
  return images;
}

// WRITE FUNCTIONS

/**
 * Add the location to the inventory and creates the location dataset.
 * @param webID contains the user webID
 * @param location contains the location to be added
 */
export async function createLocation(webID:string, location:LocationType) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let locationsFolder = `${baseURL}private/lomap/inventory/index.ttl`; // inventory folder path
  let locationId;
  // add location to inventory
  try {
    locationId = await addLocationToInventory(locationsFolder, location) // add the location to the inventory and get its ID
  } catch (error){
    // if the inventory does not exist, create it and add the location
    locationId = await createInventory(locationsFolder, location)
  }

  // path for the new location dataset
  let individualLocationFolder = `${baseURL}private/lomap/locations/${locationId}/index.ttl`
  let folder = `${baseURL}private/lomap/locations/${locationId}`
  // create dataset for the location
  try {
    await createLocationDataSet(folder,individualLocationFolder, location, locationId)
  } catch (error) {
    console.log(error)
  }
}

/**
 * Adds the given location to the location inventory
 * @param locationsFolder contains the inventory folder
 * @param location contains the location to be added
 * @returns string containing the uuid of the location
 */
export async function addLocationToInventory(locationsFolder:string, location:LocationType) {
  let inventory = await getSolidDataset(locationsFolder, {fetch: fetch}) // get the inventory
  let locationId = "LOC_" + uuid(); // create location uuid
  let baseURL = locationsFolder.split("private")[0]
  let locationURL = `${baseURL}private/lomap/locations/${locationId}/index.ttl#${locationId}` // create location dataset path

  let newLocation = buildThing(createThing({name: locationId}))
    .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL) // add to the thing the path of the location dataset
    .build();
  
  inventory = setThing(inventory, newLocation); // add thing to inventory
  try {
    await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) //save the inventory
    return locationId;
  } catch (error) {
    console.log(error);
  }
}

/**
 * Creates the location inventory and adds the given location to it
 * @param locationsFolder contains the path of the inventory
 * @param location contains the location object
 * @returns location uuid
 */
export async function createInventory(locationsFolder: string, location:LocationType){
  let locationId = "LOC_" + uuid(); // location uuid
  let baseURL = locationsFolder.split("private")[0]
  let locationURL = `${baseURL}private/lomap/locations/${locationId}/index.ttl#${locationId}` // location dataset path

  let inventory = createSolidDataset() // create dataset for the inventory

  let newLocation = buildThing(createThing({name: locationId})) // create thing with the location dataset path
    .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL)
    .build();
  
  inventory = setThing(inventory, newLocation); // add name to inventory
  try {
    await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) // save inventory dataset
    return locationId;
  } catch (error) {
    console.log(error);
  }
}


/**
 * Create the location in the given folder
 * @param locationFolder contains the folder to store the location .../private/lomap/locations/${locationId}/index.ttl
 * @param location contains the location to be created
 * @param id contains the location uuid
 */
export async function createLocationDataSet(folder:string,locationFolder:string, location:LocationType, id:string) {
  let locationIdUrl = `${locationFolder}#${id}` // construct the url of the location

  let locationImages = folder+"/images";
  // create dataset for the location
  let dataSet = createSolidDataset();
  let categoriesSerialized = serializeCategories(location.category); // serialize categories
  // build location thing
  let newLocation = buildThing(createThing({name: id})) 
  .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
  .addStringNoLocale(SCHEMA_INRUPT.longitude, location.coordinates.lng.toString())
  .addStringNoLocale(SCHEMA_INRUPT.latitude, location.coordinates.lat.toString())
  .addStringNoLocale(SCHEMA_INRUPT.description, location.description.toString())
  .addStringNoLocale(SCHEMA_INRUPT.identifier, locationIdUrl) // store the url of the location
  .addStringNoLocale(SCHEMA_INRUPT.Product, categoriesSerialized) // store string containing the categories
  .addUrl(RDF.type, "https://schema.org/Place")
  .build();


  dataSet = setThing(dataSet, newLocation); // store thing in dataset
  // save dataset to later add the images
  dataSet = await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
  console.log(locationFolder);
  await addImages(locationImages,location); // store the images
  try {
    //await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
  } catch (error) {
    console.log(error)
  }
}

/**
 * Add a review to the given location
 * @param location contains the location
 * @param review contains the review to be added to the location
 */
export async function addLocationReview(location:LocationType, review:ReviewType){
  let url = location.url?.split("#")[0] as string; // get the path of the location dataset
  // get dataset
  let locationDataset = await getSolidDataset(url, {fetch: fetch})
  // create review
  let newReview = buildThing(createThing())
    .addStringNoLocale(SCHEMA_INRUPT.name, review.title)
    .addStringNoLocale(SCHEMA_INRUPT.description, review.content)
    .addStringNoLocale(SCHEMA_INRUPT.startDate, review.date.toDateString())
    .addStringNoLocale(SCHEMA_INRUPT.Person, review.webId)
    .addUrl(VCARD.Type, VCARD.hasNote)
    .build();
  // store the review in the location dataset
  locationDataset = setThing(locationDataset, newReview)

  try {
    // save dataset
    locationDataset = await saveSolidDatasetAt(url, locationDataset, {fetch: fetch});
  } catch (error){
    console.log(error);
  }
}

/**
 * Add a rating to the given location
 * @param webId contains the webid of the user rating the location
 * @param location contains the location
 * @param score contains the score of the rating
 */
export async function addLocationScore(webId:string, location:LocationType, score:number){
  let url = location.url?.split("#")[0] as string; // get location dataset path
  // get dataset
  let locationDataset = await getSolidDataset(url, {fetch: fetch})
  // create score
  let newScore = buildThing(createThing())
    .addStringNoLocale(SCHEMA_INRUPT.value, score.toString())
    .addStringNoLocale(SCHEMA_INRUPT.Person, webId)
    .addUrl(VCARD.Type, VCARD.hasValue)
    .build();
  // add score to the dataset
  locationDataset = setThing(locationDataset, newScore)

  try {
    // save dataset
    locationDataset = await saveSolidDatasetAt(url, locationDataset, {fetch: fetch});
  } catch (error){
    console.log(error);
  }
}



/**
 * Adds locations to the given folder. 
 * @param url folder for the images
 * @param location location to store it's images
 */
export async function addImages(url: string, location:LocationType){
  location.imagesAsFile?.forEach(async image => {
  
      const savedFile = await overwriteFile(  
        url+"/"+image.name,                              
        image,                                       
        { contentType: image.type, fetch: fetch }    
      );
  })
  
}

/**
 * Deletes location dataset and from inventory
 * @param webID contains the webId of the user
 * @param locationUrl contains the location url
 * @returns updated dataset or reject if any errors arise
 */
export async function deleteLocation(webID:string, locationUrl: string) {
  let url = locationUrl.split("#")[0] as string; // get location dataset path
  let inventory = `${locationUrl.split("locations")[0]}inventory/index.ttl`;
  let locationUrlInventory = `${inventory}#${locationUrl.split("#")[1]}`
  try {
    let dataset = await getSolidDataset(url, {fetch:fetch}) // remove location dataset
    await deleteSolidDataset(dataset, {fetch: fetch})

    // remove location from inventory
    let inventoryDataset = await getSolidDataset(inventory, {fetch:fetch})
    let locationToDelete = getThing(inventoryDataset, locationUrlInventory)

    if (locationToDelete === null) return Promise.reject();
    // remove the location
    inventoryDataset = removeThing(inventoryDataset, locationToDelete);
    // update the dataset
    return await saveSolidDatasetAt(inventory, inventoryDataset, { fetch: fetch });

  } catch (error){
    return Promise.reject()
  }
}

/**
 * Grant/ Revoke permissions of friends regarding a particular location
 * @param friend webID of the friend to grant or revoke permissions
 * @param locationURL location to give/revoke permission to
 * @param giveAccess if true, permissions are granted, if false permissions are revoked
 */
export async function setAccessToFriend(friend:string, locationURL:string, giveAccess:boolean){
  let myInventory = `${locationURL.split("private")[0]}private/lomap/inventory/index.ttl`
  await giveAccessToInventory(myInventory, friend);
  let resourceURL = locationURL.split("#")[0]; // dataset path
  // Fetch the SolidDataset and its associated ACL, if available:
  let myDatasetWithAcl;
  try {
    myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, {fetch: fetch});
    // Obtain the SolidDataset's own ACL, if available, or initialise a new one, if possible:
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      if (!hasAccessibleAcl(myDatasetWithAcl)) {
        //  "The current user does not have permission to change access rights to this Resource."
      }
      if (!hasFallbackAcl(myDatasetWithAcl)) {
        // create new access control list
        resourceAcl = createAcl(myDatasetWithAcl);
      }
      else{
        // create access control list from fallback
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
      }
    } else {
      // get the access control list of the dataset
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }

  let updatedAcl;
  if (giveAccess) {
    // grant permissions
    updatedAcl = setAgentResourceAccess(
      resourceAcl,
      friend,
      { read: true, append: true, write: false, control: false }
    );
  }
  else{
    // revoke permissions
    updatedAcl = setAgentResourceAccess(
      resourceAcl,
      friend,
      { read: false, append: false, write: false, control: false }
    );
  }
  // save the access control list
  await saveAclFor(myDatasetWithAcl, updatedAcl, {fetch: fetch});
  }
  catch (error){ // catch any possible thrown errors
    console.log(error)
  }
}

export async function giveAccessToInventory(resourceURL:string, friend:string){
  let myDatasetWithAcl;
  try {
    myDatasetWithAcl = await getSolidDatasetWithAcl(resourceURL, {fetch: fetch}); // inventory
    // Obtain the SolidDataset's own ACL, if available, or initialise a new one, if possible:
    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
      if (!hasAccessibleAcl(myDatasetWithAcl)) {
        //  "The current user does not have permission to change access rights to this Resource."
      }
      if (!hasFallbackAcl(myDatasetWithAcl)) {
        // create new access control list
        resourceAcl = createAcl(myDatasetWithAcl);
      }
      else{
        // create access control list from fallback
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
      }
    } else {
      // get the access control list of the dataset
      resourceAcl = getResourceAcl(myDatasetWithAcl);
    }

  let updatedAcl;
    // grant permissions
    updatedAcl = setAgentResourceAccess(
      resourceAcl,
      friend,
      { read: true, append: true, write: false, control: false }
    );
  // save the access control list
  await saveAclFor(myDatasetWithAcl, updatedAcl, {fetch: fetch});
  }
  catch (error){ // catch any possible thrown errors
    console.log(error)
  }
}


//Friends
export async function addSolidFriend(webID: string,friendURL: string): Promise<{error:boolean, errorMessage:string}>{
  let profile = webID.split("#")[0];
  let dataSet = await getSolidDataset(profile+"#me", {fetch: fetch});//dataset card me

  let thing =await getThing(dataSet, profile+"#me") as Thing; // :me from dataset

  try{
    let newFriend = buildThing(thing)
    .addUrl(FOAF.knows, friendURL as string)
    .build();
      
    const urlRegex = /^https:\/\/[a-zA-Z0-9]+\.(solid|inrupt)\.net\/card#me$/i;//RegExp to check if it's a valid URL.

    let friends = await getSolidFriends(webID);
    if(friends.some(f => f.webID === friendURL))
      return{error:true,errorMessage:"You are already friends"}

    dataSet = setThing(dataSet, newFriend);
    dataSet = await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
  } catch(err){
    return{error:true,errorMessage:"The url is not valid."}
  }

  return{error:false,errorMessage:""}

}
export async function getFriendsID(webID:string){
  let test = getUrl(await getUserProfile(webID), FOAF.knows);
  let friendURLs = getUrlAll(await getUserProfile(webID), FOAF.knows);
  return friendURLs;
}

export async function getSolidFriends(webID:string) {
  let test = getUrl(await getUserProfile(webID), FOAF.knows);
  let friendURLs = getUrlAll(await getUserProfile(webID), FOAF.knows);
  let friends: Friend[] = [];

  let req = friendURLs.map(friend => getFriendDetails(friend))
  const results = await Promise.allSettled(req);
  const successfulResults = results
  .filter(result => result.status === 'fulfilled')
  .map(result => result.status === 'fulfilled' ? result.value : null)//WORKING
  .filter(value => value !== null) as Friend[];
  return successfulResults;
}
export async function getFriendDetails(friend: string): Promise<Friend | null>{
  try{
        
    let name = getStringNoLocale(await getUserProfile(friend),FOAF.name);
    let imageUrl: string | null = null;
  
    let pic = getUrl(await getUserProfile(friend),VCARD.hasPhoto);

    let f = null;

    if (friend){
      let f : Friend = {
        username: name as string,
        webID : friend,
        pfp: pic as string
      };
      return f;
    }
    return f;
  } catch(err){
    return null;
  }
}

export  function getSolidName(webID:string)  {
 // let name = await getSolidFriends(webId).then(friendsPromise => {return friendsPromise})

  let name =  getUserProfile(webID).then(u => getStringNoLocale(u,FOAF.name)).then(p => {return p as string});

  
}
