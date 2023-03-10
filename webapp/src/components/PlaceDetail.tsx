import React from 'react'
import { Location } from '../../../restapi/locations/Location';
import {Flex, Text,Image} from '@chakra-ui/react'

type PlaceDetailProps = {
    place : Location;
    key : number;
}

function PlaceDetail (props : PlaceDetailProps ) : JSX.Element{
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
                        {props.place.name}
                    </Text>
                </Flex>
                <Text  fontSize='x1'>
                        {props.place.description}
                </Text>
            </Flex>
            <Image 
                objectFit={'cover'}
                width={'120px'}
                height={'120px'}
                rounded='lg'
                src={
                    //TODO add here the condition on the image to be added to the locations
                    //{props.place.img} == null ? {props.place.img} : default

                    //for now we place a default image
                    'https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2560%2Cc_limit/Monkey-Selfie.jpg'
                }>

            </Image>
        </Flex>
    </Flex>
  );
}

export default PlaceDetail;
