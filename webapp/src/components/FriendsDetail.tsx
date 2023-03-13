import React from 'react'
import { Location } from '../../../restapi/locations/Location';
import {Flex, Text,Image} from '@chakra-ui/react'
import { Friend } from '../../../restapi/users/User';

type FriendsDetailProps = {
    friend : Friend;
    key : number;
}

function FriendsDetail (props : FriendsDetailProps ) : JSX.Element{
  return (
    <Flex
        bg= {'whiteAlpha.900'}
        px={4}
        py={2}
        mb={2}
        shadow='lg'
        direction={'column'}
        alignItems={'start'}
        justifyContent = 'space-between'
        >
        <Flex justifyContent={'space-between'} width ='full'>
            <Flex
                direction={'column'}
                justifyContent={'start'}
                alignItems={'start'}
                width='full'
                px={2}
                >
                <Flex
                 alignItems={'center'}
                 width={'full'}
                 justifyContent={'space-between'}>
                    <Text 
                     textTransform={'capitalize'} 
                     width={'40'}
                     fontSize={'lg'}
                     fontWeight={'500'}
                     isTruncated>
                            {props.friend.username}
                    </Text>
                </Flex>
                <Text  fontSize='x1'>
                        {props.friend.webID}
                </Text>
            </Flex>
            
        </Flex>
    </Flex>
  );
}

export default FriendsDetail;
