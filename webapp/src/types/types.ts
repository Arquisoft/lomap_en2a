export type Location = {
    name: string,
    latitude: string,
    longitude:string,
    description:string,
    url?:string // need the url to delete the location from the pod
}