import { Location } from '../../types/types';
import {Flex, Text,Image} from '@chakra-ui/react'
import LocationInfo from '../locations/LocationInfo';
import images from '../../static/images/images'
import noImage from '../static/images/no-pictures-picture.png';

type PlaceDetailProps = {
    place : Location;
    key : number;
    setSelectedView: (viewName: JSX.Element) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
}

function LocationCard (props : PlaceDetailProps ) : JSX.Element{
  return (
    <Flex
        bg= {'white'}
        px={4}
        py={2}
        mb={2}
        maxWidth='40vw'
        shadow='lg'
        direction={'column'}
        alignItems={'start'}
        justifyContent = 'space-between'
        borderRadius={'lg'}
        //change the view to the information view of the location being clicked
        onClick={
            () => props.setSelectedView(<LocationInfo location={props.place} loadLocations={props.loadLocations}></LocationInfo>)
        }
    >
        <Flex justifyContent={'space-between'} width ='full'>
            <Flex
                direction={'column'}
                justifyContent={'start'}
                alignItems={'start'}
                width='17vw'
                px={2}
                >
                <Flex
                 alignItems={'center'}
                 justifyContent={'space-between'}
                 direction='row'
                 width={'full'}>
                    <Text 
                        textTransform={'capitalize'} 
                        fontSize={'large'}
                        fontWeight={'500'}
                        isTruncated>
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
                    props.place.images?.length?
                        props.place.images[0] as string 
                        :
                        images.noPicture
                }>

            </Image>
        </Flex>
    </Flex>
  );
}

export default LocationCard;
