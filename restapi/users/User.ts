

type User ={
    username : string,

    webID : string,
    profilePicture : File,  //if not specified uses the pod one

    friendRequests :  Array<string> //array de webId
}

export type Friend={
    username : string,
    webID : string,
    pfp: string
}