

export type Location = {
    url? : String,
    name : String,
    coordinates : Coordinates,
    description : String,
    
    reviews ?: Array<Review>,
    ratings ?: Array<Number>, //stars of the location
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
    content:string
};

export function addReviewToLocation(review:Review, location:Location){
    if (location.reviews !== null){
        location.reviews?.push(review);
    }
    else{
        let reviewArray : Review[] = [];
        reviewArray.push(review);
        location.reviews = reviewArray;
    }
}

export function serializeReviews(reviews: Review[]) : string[] {
    let webIdsRecord;
    let datesRecord;
    let usernamesRecord;
    let titlesRecord;
    let contentsRecord;
    return [];
}







