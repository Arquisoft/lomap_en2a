
import { Location } from '../../../restapi/locations/Location';
import {Flex, Text,Image, Box, Avatar} from '@chakra-ui/react'
import LocationInfo from './LocationInfo';

type ReviewProps = {
    username: string,
    title:string,
    content:string,
    date: Date
}

function Review (props : ReviewProps ) : JSX.Element{
  return (
    <Flex
        bg= {'white'}
        px={4}
        py={2}
        mb={2}
        shadow='lg'
        direction={'column'}
        alignItems={'start'}
        justifyContent = 'space-between'
        borderRadius={'lg'}
        gap='0.5em'
        >
        <Flex
            direction={'row'}
            width='full'>
            <Text as={'b'}>
                {props.title}
            </Text>
            <Text marginLeft={'auto'} textColor='grey' fontSize={'0.9em'}>
                {props.date.toLocaleString()}
            </Text>
        </Flex>
        <Flex
            direction={'row'}
            alignItems='start'
            gap={'0.2em'}> 
            <Avatar 
                bg={['red.500','blue.500','green.500','orange.500'].at( Math.random() * (3 - 0))}
                size='xs'/>
            <Text as={'b'}>
                {props.username}
            </Text>
        </Flex>
        <Text>
            {props.content}
        </Text>



        
    </Flex>
  );
}

export default Review;
