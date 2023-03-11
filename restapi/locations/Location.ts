

export type Location = {
    url? : String,
    name : String,
    coordinates : Coordinates,
    description : String,
    
    review ?: Array<Review>,
    ratings ?: Array<Number>, //stars of the location
    images?: Array<string>
};

export type Coordinates = {
    lng : Number,
    lat : Number
}

export type Review = {
    webId:URL,

    username:String,
    title:String,
    content:String
};







