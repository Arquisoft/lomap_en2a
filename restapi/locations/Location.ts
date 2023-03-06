

export type Location = {

    name : String;

    coordinates : Coordinates;

    description : String;
    review ?: Array<Review>;
};

export type Coordinates = {
    lng : Number;
    lat : Number;
}

export type Review = {
    webId:URL;

    username:String;
    title:String;
    content:String;
};







