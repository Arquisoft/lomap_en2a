import React, { useContext, useState } from 'react'
import {Flex,Text, Button, Input,  InputRightElement, InputGroup, CloseButton} from "@chakra-ui/react";
import { addSolidFriend,getSolidFriends} from "../../solid/solidManagement";
import type { Friend } from "../../types/types";
import FriendsDetail from './FriendsDetail';
import { useSession } from '@inrupt/solid-ui-react';

type FriendsProps = {
  setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
}

function Friends(props:FriendsProps) : JSX.Element {
  //we load the session
  const session = useSession()

  const webId = session.session.info.webId;
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const[isLoged, setLogged] = React.useState(false);

  const[error, setError]=React.useState(false);
  const[errorMessage,setErrorMessage]=React.useState("");

  React.useEffect(() => {
    handleFriends()
  }, [friends]);

  const handleFriends = async () => {
    if (webId !== undefined && webId !== ""){
      const n  = await getSolidFriends(webId)
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
    const result = addSolidFriend(webId as string,value);
    result.then(r=>{setError(r.error);setErrorMessage(r.errorMessage);})
    handleFriends();
  }

    return (
        <Flex
          direction={'column'}
          bg={'white'}
          width={"30%"}
          height={"100%"}
          position={'absolute'} 
          left='3%'
          top={0}
          zIndex={1}
          borderWidth={'1px'}
          overflow='hidden'>
          <CloseButton 
                    onClick={() => props.setSelectedView(<></>)}
                    position='absolute'
                    top='2%'
                    right='3%'
          ></CloseButton>
          { 
            session.session.info.isLoggedIn ?
            <Flex direction={"column"} marginTop={'5%'} width={'90%'} marginLeft={'3%'}>
              <Text fontSize='1.9em' borderBottomWidth='1px' alignSelf='center'
              marginTop='2%' marginBottom='3%'>Add Friend to Solid</Text>
              
              <Flex direction='row' width={'95%'} marginLeft='4%'>
                <Input data-testid ='inputFriends' width='98%' placeholder='Friend webID' 
                  type='text' id="newFriend" name="newFriend" required size='lg'/>
                  <Button size='lg' backgroundColor='blue.300' 
                    color={'white'} marginRight={'0%'} onClick={(event) => handleSubmitSolid(event)}>+</Button>                   
                  {error && <Text>{errorMessage}</Text> }
              </Flex>
              <Text fontSize='1.9em' borderBottomWidth='1px' 
              marginTop={'4%'} alignSelf='center'>Current Solid Friends</Text>
              <Flex flex={1} overflowY={'scroll'}overflowX={'scroll'} width={'100%'} 
                mt={'3%'} direction={'column'} margin={'2%'} px={'2%'}>
              {
                  friends.length > 0 ? friends.map((f,i) => <FriendsDetail friend={f} key ={i}/>) 
                  : <Text margin='auto'>Uups! It seems you don't have any friends...</Text>
              }
              </Flex>
            </Flex>
            :
            <Text fontSize='1.2em' borderBottomWidth='1px' margin={'3%'}>You are not logged in</Text>
          }
          
        </Flex>
      )
}
export default Friends;