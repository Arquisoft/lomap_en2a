import { Location } from "../types/types";

export enum Category {
    Shop="Shop", Bar="Bar", Sight="Sight", 
    Museum="Museum", Park="Park", Other="Other"
}

/**
 * Pass the array of strings to simple string
 * @param categories 
 * @returns string
 */
export function serializeCategories(categories : string[]) : string {
    return categories.join("-");
}

/**
 * Pass simple string to array of strings
 * @param categories 
 * @returns string[]
 */
export function deserializeCategories(categories : string) : string[] {
    return categories.split("-");
}

/**
 * Returns true if a location is of a determined category, false otherwise
 * @param location 
 * @param category 
 * @returns true/false
 */
export function isLocationOfCategory(location:Location, category:string) : boolean {
    let res = location.category.indexOf(category);
    return res > -1 ? true: false;
}