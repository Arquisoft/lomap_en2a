

type User ={
    username : String,

    webID : String,
    profilePicture : File,  //if not specified uses the pod one

    friendRequests :  Array<String> //array de webId
}