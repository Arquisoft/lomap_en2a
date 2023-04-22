export type Friend={
    username : string,
    webID : string,
    pfp: string
};
export type Location = {
    url? : string,
    name : string,
    coordinates : Coordinates,
    description : string,
    category: Array<string>,
    
    reviews ?: Array<Review>,
    ratings ?: Map<string,Number>, //stars of the location <webId,number>
    images?: Array<string>,
    imagesAsFile?:Array<File>
};

export type Coordinates = {
    lng : Number,
    lat : Number
};

export type Review = {
    webId:string,
    date: string,
    title:string,
    content:string,
    username:string
};
export type User = {
    name:string;
    email:string;
  }