import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Flex,Text,Avatar,VStack, Box, Button, Input, InputRightAddon, InputRightElement, InputGroup} from "@chakra-ui/react";
import {  SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import  PlaceDetail  from './PlaceDetail';
import {addFriend, getFriends} from "../solid/solidManagement";
import type { Friend } from "../../../restapi/users/User";
import FriendsDetail from './FriendsDetail';

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { event } from 'jquery';
function Friends(props : any) : JSX.Element {

    
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const[isLoged, setLogged] = React.useState(false);
  const[isLoading,setLoading] = React.useState(true);
  React.useEffect(() => {
    handleFriends()
  }, [friends]);

  const handleFriends = async () => {
    if (props.webId !== undefined && props.webId !== ""){
      const n  = await getFriends(props.webId).then(friendsPromise => {return friendsPromise});
      setFriends(n);
      setLogged(true);
    }
    else{
      setFriends([]);
    }
  }
  const handleSubmit = (event)=>{
    event.preventDefault();
    let value = (document.getElementById("newFriend")as HTMLInputElement).value;
    console.log(value);
    addFriend(props.webId,{username:value,webID:value+"url"})
    handleFriends();
    
  }

    return (
        <Flex
          direction={'column'}
          bg={'whiteAlpha.900'}
          width={"30vw"}
          height={"100vh"}
          position={'absolute'} 
          left='5vw'
          top={0}
          zIndex={1}
          overflow='hidden'
          px={2}>
          
          {
            
            props.session.session.info.isLoggedIn ?
            <Flex direction={"column"}>
              <Text fontSize='1.2em' borderBottomWidth='1px' margin={'20px'}>Add Friend</Text>
              
              <form onSubmit={handleSubmit} >
                <InputGroup>
                <Input placeholder='Friend URL' type='text' id="newFriend" name="newFriend"required/>
                <InputRightElement>
                <Button type='submit'>+</Button> 
                </InputRightElement></InputGroup>
              </form>
              <Text fontSize='1.2em' borderBottomWidth='1px' margin={'20px'}>Friends</Text>
              <Flex flex={1} overflowY={'scroll'} mt={3} direction={'column'} >
              {
                  friends.map((f,i) => <FriendsDetail friend={f} key ={i}/>)
              }
              </Flex>
            </Flex>
            :
            <text>You are not logged.</text>

            
          }
          
        </Flex>
      )
}
export default Friends;