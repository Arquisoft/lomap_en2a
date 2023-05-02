import {Flex, Text, Box, Avatar} from '@chakra-ui/react'
import React, { useState } from 'react'
import { getProfileImage } from '../../solid/solidManagement'

type ReviewProps = {
    username: string,
    title:string,
    content:string,
    date: string
    webId: string
}

function Review (props : ReviewProps ) : JSX.Element{
    const[usrImage, setUsrImage] = useState<string>('')

    //once redered we try to get the profile image of the user
    React.useEffect(() => {
        getProfileImage(props.webId).then((image) => {
            setUsrImage(image)
        })
    }, []);

  return (
    <Flex
        bg= {'white'}
        px={'4%'}
        py={'2%'}
        mb={'2%'}
        shadow='lg'
        direction={'column'}
        alignItems={'start'}
        borderRadius={'lg'}
        borderWidth={'1px'}
        mt='3%'
        gap='0.5em'
        width='full'
        >
        <Flex
            direction={'row'}
            width='full'>
            <Flex
            direction={'row'}
            alignItems='start'
            gap={'0.2em'}> 
                <Avatar 
                    src={usrImage}
                    bg={'blue.500'}
                    size='xs'/>
                <Text as={'b'} fontSize='0.8em'>
                    {props.username}
                </Text>
            </Flex>
            <Text marginLeft={'auto'} textColor='grey' fontSize={'0.9em'}>
                {props.date.substring(0, 10)} at {props.date.substring(11,16)}
            </Text>
        </Flex>
        <Box width='full'>
                <Text as={'b'}>
                    {props.title}
                </Text>
        </Box>
        <Box width='full'>
            <Text>
                {props.content}
            </Text>
        </Box>
    </Flex>
  );
}

export default Review;
