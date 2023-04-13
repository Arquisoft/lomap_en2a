

export type Location = {
    url? : string,
    name : string,
    coordinates : Coordinates,
    description : string,
    category: Array<string>,
    
    reviews ?: Array<Review>,
    ratings ?: Map<string,Number>, //stars of the location <webId,number>
    images?: Array<string>
};

export type Coordinates = {
    lng : Number,
    lat : Number
}

export type Review = {
    webId:string,
    date: Date,
    title:string,
    content:string,
    username:string
};
