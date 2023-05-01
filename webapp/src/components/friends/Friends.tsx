import React from 'react'
import {Flex,Text, Button, Input, CloseButton, Spinner} from "@chakra-ui/react";
import { addSolidFriend,getSolidFriends} from "../../solid/solidManagement";
import type { Friend } from "../../types/types";
import FriendsDetail from './FriendsDetail';
import { useSession } from '@inrupt/solid-ui-react';
import {MdPersonAdd} from "react-icons/md";

type FriendsProps = {
  setSelectedView: (viewName: string) => void //function to change the selected view on the left
}

function Friends(props:FriendsProps) : JSX.Element {
  //we load the session
  const session = useSession()

  const webId = session.session.info.webId;
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const[, setLogged] = React.useState(false);
  const[friendChargingMsg, setFriendChargingMsg] = React.useState("Loading...")

  const[error, setError]=React.useState(false);
  const[errorMessage,setErrorMessage]=React.useState("");
  const[addIcon, setAddIcon] = React.useState(<MdPersonAdd></MdPersonAdd>)

  React.useEffect(() => {
    void handleFriends()
  }, [friends]);

  const handleFriends = async () => {
    if (webId !== undefined && webId !== ""){
      const n  = await getSolidFriends(webId)
      setFriends(n);
      if (n.length === 0)
        setFriendChargingMsg("Uups! It seems you don't have any friends...")
      setLogged(true);
    }
    else{
      setFriends([]);
    }
  }

  
  const handleSubmitSolid= async (event)=>{
    event.preventDefault();
    setAddIcon(<Spinner size={"xs"}/>)
    let value = (document.getElementById("newFriend")as HTMLInputElement).value;
    const result = await addSolidFriend(webId as string,value);
    setAddIcon(<MdPersonAdd/>)
    setError(result.error);setErrorMessage(result.errorMessage);
    void handleFriends();
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
          overflow='auto'>
          <CloseButton 
                    onClick={() => props.setSelectedView('Map')}
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
                    color={'white'} marginRight={'0%'} onClick={(event) => handleSubmitSolid(event)}
                    leftIcon={addIcon}
                  ></Button>                   
              </Flex>
              {error && <Text marginLeft='5%'>{errorMessage}</Text> }
              <Text fontSize='1.9em' borderBottomWidth='1px' 
              marginTop={'4%'} alignSelf='center'>Current Solid Friends</Text>
              <Flex flex={1} overflowY={'auto'} overflowX={'auto'} width={'100%'}
                mt={'3%'} direction={'column'} margin={'2%'} px={'2%'}>
              {
                  friends.length > 0 ? friends.map((f,i) => <FriendsDetail friend={f} key ={i}/>) 
                  : <Text margin='auto'>{friendChargingMsg}</Text>
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