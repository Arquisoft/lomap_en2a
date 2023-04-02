import type { Location as LocationType, Review }from "../../../restapi/locations/Location";
import type { Review as ReviewType} from "../../../restapi/locations/Location";
import type { Friend } from "../../../restapi/users/User";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { getThingAll } from "@inrupt/solid-client";
import { addReviewToLocation } from "../../../restapi/locations/Location";

import {
  createThing, removeThing,Thing,getThing, setThing,buildThing,
  getSolidDataset, saveSolidDatasetAt, 
  getUrlAll, getUrl,
  getStringNoLocale,
  createSolidDataset
} from "@inrupt/solid-client";

import { FOAF, VCARD, SCHEMA_INRUPT, RDF} from "@inrupt/vocab-common-rdf"

import {v4 as uuid} from "uuid"


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
  let inventoryFolder = `${baseURL}private/lomap/inventory/index.ttl`; // locations contained in index.ttl 
  let locations: LocationType[] = []; // initialize array of locations
  let locationPaths; 
  try {
    let dataSet = await getSolidDataset(inventoryFolder, {fetch: fetch}); // get the locations dataset
    locationPaths = getThingAll(dataSet) // get the things from the dataset
    for (let locationPath of locationPaths) { // for each location in the dataset

      let path = getStringNoLocale(locationPath, SCHEMA_INRUPT.identifier) as string;

      let location = await getLocationFromDataset(path)
      locations.push(location)
    }
  } catch (error) {
    // if the location dataset does no exist, return empty array of locations
    locations = [];
  }
  
  return locations;
}

export async function getLocationFromDataset(locationPath:string){
  let datasetPath = locationPath.split('#')[0] // get until index.ttl
  let locationDataset = await getSolidDataset(datasetPath, {fetch: fetch})
  let locationAsThing = getThing(locationDataset, locationPath) as Thing;

  let name = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.name) as string; 
  let longitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.longitude) as string; 
  let latitude = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.latitude) as string; 
  let description = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.description) as string; 
  let url = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.identifier) as string;
  //let imagesFolder = getStringNoLocale(locationAsThing, SCHEMA_INRUPT.URL) as string; // path of the images folder
  
  let locationImages: string [] = []; // initialize array to store the images as strings
  locationImages = await getLocationImage(locationPath);
  let reviews: ReviewType[] = [];
  reviews = await getLocationReviews(locationPath)

  let location : LocationType = {
      name: name,
      coordinates : {lng: new Number(longitude), lat: new Number(latitude)},
      description: description,
      url: url,
      images: locationImages,
      reviews: reviews
  }
  return location;

}

export async function getLocationReviews(folder:string) {
  let reviews : ReviewType[] = [];
  try {
    let dataSet = await getSolidDataset(folder, {fetch:fetch});
    let thing = getThing(dataSet, VCARD.hasNote) as Thing
    let urls = getUrlAll(thing, VCARD.hasNote)

    for (let reviewURL of urls) {
      let review = getThing(dataSet, reviewURL) as Thing

      let title = getStringNoLocale(review, SCHEMA_INRUPT.name) as string;
      let content = getStringNoLocale(review, SCHEMA_INRUPT.description) as string;
      let date = new Date(getStringNoLocale(review, SCHEMA_INRUPT.startDate) as string);
      let webId = getStringNoLocale(review, SCHEMA_INRUPT.Person) as string;

      let newReview : ReviewType = {
        title: title,
        content: content,
        date: date,
        webId: webId
      }

      reviews.push(newReview);
    }

  } catch (error) {
    reviews = [];
    console.log(error)
  }
  return reviews;
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
      if (img !== null)
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
export async function createLocation(webID:string, location:LocationType) {
  let baseURL = webID.split("profile")[0]; // url of the type https://<nombre>.inrupt.net/
  let locationsFolder = `${baseURL}private/lomap/inventory/index.ttl`; // general folder path
  let locationId;
  // add location to inventory
  try {
    locationId = await addLocationToInventory(locationsFolder, location)
  } catch (error){
    locationId = await createInventory(locationsFolder, location)
  }

  // path for the new location dataset
  let individualLocationFolder = `${baseURL}private/lomap/locations/${locationId}/index.ttl`

  // create dataset for the location
  try {
    await createLocationDataSet(individualLocationFolder, location, locationId)
  } catch (error) {
    console.log(error)
  }
}

export async function addLocationToInventory(locationsFolder:string, location:LocationType) {
  let inventory = await getSolidDataset(locationsFolder, {fetch: fetch}) // get the inventory
  let locationId = "LOC_" + uuid(); // location id
  let baseURL = locationsFolder.split("private")[0]
  baseURL += `private/lomap/locations/${locationId}/index.ttl`
  let locationURL = `${baseURL}#${locationId}`; // location url

  let newLocation = buildThing(createThing({name: locationId})) // create thing with the url
    .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL)
    .build();
  
  inventory = setThing(inventory, newLocation); // add thing to inventory
  try {
    await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) //private/lomap/inventory/index.ttl
    return locationId;
  } catch (error) {
    console.log(error);
  }
}

export async function createInventory(locationsFolder: string, location:LocationType){
  let locationId = "LOC_" + uuid(); // location id
  let baseURL = locationsFolder.split("private")[0]
  baseURL += `private/lomap/locations/${locationId}/index.ttl`
  let locationURL = `${baseURL}#${locationId}`; // location url

  let inventory = createSolidDataset()

  let newLocation = buildThing(createThing({name: locationId})) // create thing with the url
    .addStringNoLocale(SCHEMA_INRUPT.identifier, locationURL)
    .build();
  
  inventory = setThing(inventory, newLocation); // add name to inventory
  try {
    await saveSolidDatasetAt(locationsFolder, inventory, {fetch: fetch}) //private/lomap/inventory/index.ttl
    return locationId;
  } catch (error) {
    console.log(error);
  }
}


/**
 * Create the location in the given folder
 * @param locationFolder contains the folder to store the location .../private/lomap/locations/${locationId}/index.ttl
 * @param location contains the location to be created
 */
export async function createLocationDataSet(locationFolder:string, location:LocationType, id:string) {
  let locationIdUrl = `${locationFolder}#${id}` // construct the url of the location

  // create dataset for the location
  let dataSet = createSolidDataset();

  // build location thing
  let newLocation = buildThing(createThing({name: id})) 
  .addStringNoLocale(SCHEMA_INRUPT.name, location.name.toString())
  .addStringNoLocale(SCHEMA_INRUPT.longitude, location.coordinates.lng.toString())
  .addStringNoLocale(SCHEMA_INRUPT.latitude, location.coordinates.lat.toString())
  .addStringNoLocale(SCHEMA_INRUPT.description, location.description.toString())
  //.addStringNoLocale(SCHEMA_INRUPT.URL, locationFolder) // add image folder path (same as the location folder)
  .addStringNoLocale(SCHEMA_INRUPT.identifier, locationIdUrl) // store the url of the location
  .addUrl(RDF.type, "https://schema.org/Place")
  .build();


  dataSet = setThing(dataSet, newLocation); // store thing in dataset
  // save dataset to later add the images
  dataSet = await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
  await addLocationImage(locationFolder, location); // store the images
  // addLocationReview(locationFolder, location) // store the reviews
  // addLocationScore(locationFolder, location) // store the score
  try {
    await saveSolidDatasetAt(locationFolder, dataSet, {fetch: fetch}) // save dataset 
  } catch (error) {
    console.log(error)
  }
}

  export async function addLocationReview(location:LocationType, review:ReviewType){
    let url = location.url?.split("#")[0] as string;
    // get dataset
    let locationDataset = await getSolidDataset(url, {fetch: fetch})
    // location.reviews?.forEach(async review => {
      let newReview = buildThing(createThing())
        .addStringNoLocale(SCHEMA_INRUPT.name, review.title)
        .addStringNoLocale(SCHEMA_INRUPT.description, review.content)
        .addStringNoLocale(SCHEMA_INRUPT.startDate, review.date.toDateString())
        .addStringNoLocale(SCHEMA_INRUPT.Person, review.webId)
        .addUrl(VCARD.Type, VCARD.hasNote)
        .build();

      let hasReviews = getThing(locationDataset, VCARD.hasNote) as Thing;
      if (hasReviews === null) {
        // we create the thing as it has not been done before
        hasReviews = buildThing(createThing())
          .addUrl(VCARD.hasNote, newReview.url)
          .build();
      }
      else {
        hasReviews = buildThing(hasReviews)
          .addUrl(VCARD.hasNote, newReview.url)
          .build();

      }

      locationDataset = setThing(locationDataset, newReview)
      locationDataset = setThing(locationDataset, hasReviews)

      try {
        locationDataset = await saveSolidDatasetAt(url, locationDataset, {fetch: fetch});
      } catch (error){
        console.log(error);
      }
  }

  export async function addLocationScore(url:string, location:LocationType){

  }

/**
 * Add the location images to the given folder
 * @param url contains the folder of the images .../private/lomap/locations/${locationId}/index.ttl
 * @param location contains the location
 */
export async function addLocationImage(url: string, location:LocationType) {
  let locationDataset = await getSolidDataset(url, {fetch: fetch})
  location.images?.forEach(async image => { // for each image of the location, build a thing and store it in dataset
      let newImage = buildThing(createThing({name: image}))
      .addStringNoLocale(SCHEMA_INRUPT.image, image)
      .build();
      locationDataset = setThing(locationDataset, newImage);
      try {
        locationDataset = await saveSolidDatasetAt(url, locationDataset, {fetch: fetch});
      } catch (error){
        console.log(error);
      }
    }
  );
}


export async function deleteLocation(webID:string, locationUrl: string) {
  let locationFolder = locationUrl.split("index.ttl")[0];
  try {
    let dataSet = await getSolidDataset(locationFolder, {fetch: fetch}); // fetch locations dataset
    // obtain the location from the POD
    let location = getThing(dataSet, locationUrl) as Thing;

    // cant remove something that does not exist
    if (location === null) return Promise.reject();
    // remove the location
    dataSet = removeThing(dataSet, location);
    
    // update the dataset
    return await saveSolidDatasetAt(locationFolder, dataSet, { fetch: fetch });
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
      if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
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
      if(friends.some(f=>  f.webID.toString() === friend.webID.toString())){
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
  
    await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
    return{error:false,errorMessage:""}

}
