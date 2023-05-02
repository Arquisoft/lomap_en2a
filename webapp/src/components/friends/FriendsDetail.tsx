
import {Flex, Text,Image, Avatar} from '@chakra-ui/react'
import type { Friend } from '../../types/types';

type FriendsDetailProps = {
    friend : Friend;
    key : number;
}

function FriendsDetail (props : FriendsDetailProps ) : JSX.Element{
  return (
    <Flex
        bg= {'whiteAlpha.900'}
        mb={'2%'}
        direction={'column'}
        alignItems={'start'}
        borderRadius={'15'}
        borderWidth={'thin'}
        justifyContent = 'space-between'
        
        >
        <Flex
            direction={'column'}
            justifyContent={'start'}
            alignItems={'start'}
            width='full'
            px={'2%'}
            py={'2%'}
            >
            <Flex
                alignItems={'center'}
                width={'full'}
                gap='3%'
                >
                <Avatar 
                    src={props.friend.pfp as string} 
                    name ={props.friend.username}
                    data-testid = 'friendImage'
                />
                <Text 
                    textTransform={'capitalize'} 
                    width={'fit-content'}
                    fontSize={'1.3em'}
                    isTruncated>
                        {props.friend.username}
                </Text>
            </Flex>
            <Text marginTop='2%' fontSize='0.9em'>{props.friend.webID}</Text>
        </Flex>
    </Flex>
  );
}

export default FriendsDetail;
