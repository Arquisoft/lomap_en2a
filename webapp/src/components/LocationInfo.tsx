import { Text,Stack, HStack, Image, Box, Flex, Button, Icon, Heading, Divider} from "@chakra-ui/react"
import {RxCross2}  from "react-icons/rx";
import { Location } from "../../../restapi/locations/Location";


type LocationInfoProps = {
  location : Location
  deleteLocation : (loc : Location) => void
};

export default function LocationInfo (props : LocationInfoProps) : JSX.Element {  

  return (
    <Flex
        direction={'column'}
        bg={'white'}
        width={"30vw"}
        height={"100vh"}
        position={'absolute'} 
        left={'5vw'}
        top={0}
        bottom={-4}
        zIndex={1}
        overflow='hidden'
        px={2}
        >
      <Heading
        fontSize='xx-large'
        as='b'  
        isTruncated
        paddingLeft={'0.6em'}
        paddingBottom={'0.5em'} 
        >
        {props.location.name}
      </Heading>

      <Divider borderWidth={'0.18em'} borderColor='black'  borderRadius={"lg"} width='20em' />

      <Text as='b'>Pictures:</Text>
      <HStack shouldWrapChildren={true} display='flex' overflowX='auto'> 
          {
          props.location.images?.length != null ? 
          (
            props.location.images?.map((image)=>{
              return (
                <Image 
                  src={image as string} 
                  width='200'
                  height='200'
                  borderRadius='lg'
                  fallbackSrc='https://via.placeholder.com/150'>
                </Image>
              )
            })   
          ) 
          : 
          <Text>
              No photos available
          </Text>
          }
        </HStack>


      <Text as={'b'} >Description:</Text>
      <Flex
        direction={'column'}
        overflowY='auto'
        marginBottom='1.05em'
        >
        <Text textAlign={'justify'} margin='1.2em'>{props.location.description}</Text>  
      </Flex>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
        <Button colorScheme='red' leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
          size='lg'
          onClick={() => {
            //we show a 

            //we delete the props.location that is being showed
            props.deleteLocation(props.location);
          }}
        >
          Delete location
        </Button>
      </Box>
    </Flex>
  )
}

  