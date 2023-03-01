

export type Location = {

    name : String;

    longitude : Number;
    latitude : Number;

    description : String;
    review ?: Array<Review>;
};

export type Review = {
    webId:URL;

    username:String;
    title:String;
    content:String;
};







