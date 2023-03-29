import { Location } from "../../../restapi/locations/Location";

export enum Category {
    Shop="Shop", Bar="Bar", Sight="Sight", 
    Museum="Museum", Park="Park", Other="Other"
}


export function serializeCategories(categories : string[]) : string {
    return categories.join("-");
}

export function deserializeCategories(categories : string) : string[] {
    return categories.split("-");
}

export function isLocationOfCategory(location:Location, category:string) : boolean {
    let res = location.category.indexOf(category);
    return res > -1 ? true: false;
}

export function filterLocationsByCategory(locations : Location[], category: string) : Location[] {
    let ret : Location[] = [];
    ret = locations.filter((location) => isLocationOfCategory(location, category))
    return ret;
}