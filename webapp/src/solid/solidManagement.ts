import type { Location } from "../types/types";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { Session } from "@inrupt/solid-client-authn-browser";

import {
    createThing,
    getUrlAll,
    getPodUrlAll,
    Thing, createSolidDataset,
    getSolidDataset,
    getThing, setThing,
    saveSolidDatasetAt, buildThing
} from "@inrupt/solid-client";

import { VCARD } from "@inrupt/vocab-common-rdf"

const session = new Session();

// login
async function login() {
    if (!session.info.isLoggedIn) {
      await session.login({
        oidcIssuer: "https://inrupt.net/",
        clientName: "Lo Map",
        redirectUrl: window.location.href
      });
    }
  }


export async function getUserProfile(webID: string) : Promise<Thing>{
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    let dataSet = await getSolidDataset(profile, {fetch});
    return getThing(dataSet, webID) as Thing;
}


export async function createLocation(webID:string, location:Location) {
    let profile = webID.split("#")[0]; //just in case there is extra information in the url
    let dataSet = await getSolidDataset(profile, {fetch: session.fetch});
    
    // We create the location
    const newLocation = buildThing(createThing())
    .addStringNoLocale(VCARD.Name, location.name)
    .addStringNoLocale(VCARD.longitude, location.longitude)
    .addStringNoLocale(VCARD.latitude, location.latitude)
    .addStringNoLocale(VCARD.Text, location.description)
    .addUrl(VCARD.Type, VCARD.Location)
    .build();

    let existLocations = await getThing(dataSet, VCARD.hasGeo);
    if (existLocations === null){
      existLocations = buildThing(await getUserProfile(webID)).addUrl(VCARD.hasGeo, newLocation.url).build();
    }
    else{
      existLocations = buildThing(await getUserProfile(webID)).addUrl(VCARD.hasGeo, newLocation.url).build();
    }

    dataSet = setThing(dataSet, newLocation);
    dataSet = setThing(dataSet, existLocations);

    return await saveSolidDatasetAt(webID, dataSet, {fetch: fetch})
}


