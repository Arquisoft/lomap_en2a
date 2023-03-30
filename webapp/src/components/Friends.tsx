import React from 'react'
import {Flex,Text, Button, Input,  InputRightElement, InputGroup} from "@chakra-ui/react";
import { addSolidFriend,getSolidFriends} from "../solid/solidManagement";
import type { Friend } from "../../../restapi/users/User";
import FriendsDetail from './FriendsDetail';


function Friends(props : any) : JSX.Element {
  const webId = props.session.session.info.webId;
    
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const[isLoged, setLogged] = React.useState(false);

  const[error, setError]=React.useState(false);
  const[errorMessage,setErrorMessage]=React.useState("");

  React.useEffect(() => {
    handleFriends()
  }, [friends]);

  const handleFriends = async () => {
    if (webId !== undefined && webId !== ""){
      const n  = await getSolidFriends(webId).then(friendsPromise => {return friendsPromise});
      
      setFriends(n);
      setLogged(true);
    }
    else{
      setFriends([]);
    }
  }

  
  const handleSubmitSolid= (event)=>{
    event.preventDefault();
    let value = (document.getElementById("newFriend")as HTMLInputElement).value;
    
    const result = addSolidFriend(webId,value);
    result.then(r=>{setError(r.error);setErrorMessage(r.errorMessage);})
    
    handleFriends();

  }

    return (
        <Flex
          direction={'column'}
          bg={'white'}
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
              
              <form onSubmit={handleSubmitSolid} >
                <InputGroup>
                <Input placeholder='Friend URL' type='text' id="newFriend" name="newFriend"required/>
                <InputRightElement>
                <Button type='submit'>+</Button> 
                </InputRightElement>
                
                </InputGroup>
                {error && <Text>{errorMessage}</Text> }
                
              </form>
              <Text fontSize='1.2em' borderBottomWidth='1px' margin={'20px'}>Friends</Text>
              <Flex flex={1} overflowY={'scroll'}overflowX={'scroll'} mt={3} direction={'column'} >
              {
                  friends.map((f,i) => <FriendsDetail friend={f} key ={i}/>)
              }
              </Flex>
            </Flex>
            :
            <Text fontSize='1.2em' borderBottomWidth='1px' margin={'20px'}>You are not logged in</Text>

            
          }
          
        </Flex>
      )
}
export default Friends;