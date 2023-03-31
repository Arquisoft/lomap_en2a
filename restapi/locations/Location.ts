

export type Location = {
    url? : String,
    name : String,
    coordinates : Coordinates,
    description : String,
    
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
    username:string,
    title:string,
    content:string
};







