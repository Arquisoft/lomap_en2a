
import { Location } from '../../../restapi/locations/Location';
import {Flex, Text,Image, Box} from '@chakra-ui/react'
import LocationInfo from './LocationInfo';

type PlaceDetailProps = {
    place : Location;
    key : number;
    deleteLocation : (loc : Location) => void
    setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
}

function PlaceDetail (props : PlaceDetailProps ) : JSX.Element{
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
        //change the view to the information view of the location being clicked
        onClick={() => props.setSelectedView(<LocationInfo location={props.place} deleteLocation = {props.deleteLocation} ></LocationInfo>)}
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
                 width={'auto'}
                 justifyContent={'space-between'}
                 direction='row'>
                    
                    <Text 
                    textTransform={'capitalize'} 
                    width={'40'}
                    fontSize={'large'}
                    fontWeight={'500'}>
                        {props.place.name}
                    </Text>
                    
                </Flex>
                <Text  
                    fontSize='x1'
                    noOfLines={3}>
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
                    //props.place.images[0] != null ? props.place.images[0] : 'https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2560%2Cc_limit/Monkey-Selfie.jpg'

                    //for now we place a default image
                    'https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/w_2560%2Cc_limit/Monkey-Selfie.jpg'
                }>

            </Image>
        </Flex>
    </Flex>
  );
}

export default PlaceDetail;
