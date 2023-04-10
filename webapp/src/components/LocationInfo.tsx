import { Text,Stack, HStack, Image, Box, Flex, Button, Icon, Heading, Divider} from "@chakra-ui/react"
import {RxCross2}  from "react-icons/rx";
import { Location } from "../../../restapi/locations/Location";
import Review from "./Review";


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
        paddingLeft={'0.6em'}
        paddingBottom={'0.5em'} 
        >
        {props.location.name}
      </Heading>

      <Divider borderWidth={'0.18em'} borderColor='black'  borderRadius={"lg"} width='20em' />
      <Flex
        direction={'column'}
        overflowY='auto'>

        <Text as='b'fontSize={'x-large'}>Pictures:</Text>
        <HStack shouldWrapChildren={true} display='flex' overflowX='auto' minHeight={'2em'}> 
            {
            props.location.images?.length? 
            (
              props.location.images?.map((image)=>{
                return (
                  <Image 
                    src={image as string} 
                    width='200'
                    height='200'
                    borderRadius='lg'
                    fallbackSrc='https://www.resultae.com/wp-content/uploads/2018/07/reloj-100.jpg'>
                  </Image>
                )
              })   
            ) 
            : 
            <Text>
              No photos available for this location
            </Text>
            }
          </HStack>


        <Text as={'b'} fontSize={'x-large'} >Description:</Text>
        <Flex
          direction={'column'}
          overflowY='auto'
          marginBottom='1.05em'
          maxHeight={'30vh'}
          minHeight='15vh'
          bgColor='blackAlpha.200'
          border={"1px"}
          borderRadius='lg'
          >
          <Text 
            textAlign={'justify'}
            margin='1.2em'>
              {props.location.description.trim().length > 0 ? props.location.description : 'No description for this location'}
          </Text>  
        </Flex>

        <Text as={'b'} fontSize={'x-large'} >Reviews:</Text>
        {
          props.location.review?
            props.location.review.map((rev,i)=>{<Review title="Review1" username="monkey" content="This is the content of the review"/>})
            :
            <Text>No reviews for this location.</Text>
        }
        

      </Flex>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
        <Button colorScheme='red' leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
          size='lg'
          onClick={() => {
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

  