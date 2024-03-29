import { Location } from '../../types/types';
import {Flex,HStack, Text,Image,Icon,Box,VStack} from '@chakra-ui/react'
import images from '../../static/images/images'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import BubbleContainer from './CategoriesBubbles';

type PlaceDetailProps = {
    place : Location;
    key : number;
    setSelectedView: (viewName: string) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
    setSelectedLocation: (location: Location ) => void
}

type LocationRatingProps = {
    location : Location
}

const LocationRating: React.FC<LocationRatingProps> = ({ location }: LocationRatingProps) => {
    const { ratings } = location;
  
    if (!ratings || ratings.size === 0) {
      return (
        <HStack width='fit-content' spacing={1}>
          {[...Array(5)].map((_, i) => (
            <Icon key={i} as={FaStar} color="gray.300" data-testid={'star'+i+'unselected'} />
          ))}
        </HStack>
      );
    }

    let acc = 0;
    for(const rating of ratings.values()){
        acc += rating as number;
    }
    let avgRating = acc / ratings.size;
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  
    return (
      <HStack width='fit-content' spacing={1}>
        {[...Array(fullStars)].map((_, i) => (
            <Icon key={i} as={FaStar} color="yellow.400" data-testid={'star'+i+'selected'}/>
        ))}
        {halfStar && <Icon as={FaStarHalfAlt} color="yellow.400" data-testid='halfStar'/>}
        {[...Array(emptyStars)].map((_, i) => (
            <Icon key={i} as={FaStar} color="gray.300" data-testid={'star'+i+'unselected'}/>
        ))}
      </HStack>
    );
  };

function LocationCard (props : PlaceDetailProps ) : JSX.Element{

  return (
    <Flex
        bg= {'white'}
        px={'2%'}
        py={'2%'}
        mb={'2%'}
        maxWidth='100%'
        shadow='lg'
        direction={'column'}
        alignItems={'start'}
        justifyContent = 'space-between'
        borderRadius={'lg'}
        //change the view to the information view of the location being clicked
        onClick={() => 
            {
                //we update the selected location to be the one on this card
                props.setSelectedLocation(props.place);
                props.setSelectedView('LocationInfo')}
        }
        cursor={'pointer'}
    >
        <Flex justifyContent={'space-between'} width ='full'>
            <Flex
                direction={'column'}
                justifyContent={'start'}
                alignItems={'start'}
                width='70%'
                px={'2%'}
                gap={'1.1em'}
                >
                <VStack alignItems={'start'} width={'full'}>
                  <Flex
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  direction='row'
                  width={'full'}>
                      <Text 
                          textTransform={'capitalize'} 
                          fontSize={'large'}
                          fontWeight={'500'}
                          width={'70%'}
                          isTruncated>
                          {props.place.name}
                      </Text>
                  </Flex> 
                  <LocationRating location={props.place} ></LocationRating>
                </VStack>
                <Text  
                    fontSize='x1'
                    noOfLines={2}>
                        {props.place.description}
                </Text>
                <Box marginTop={'auto'}>
                  <BubbleContainer location={props.place} ></BubbleContainer>
                </Box>
            </Flex>
            <Image 
                objectFit={'cover'}
                width={'23%'}
                height={'100%'}
                rounded='lg'
                alignSelf={'center'}
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