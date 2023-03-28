import { Text,Stack, HStack, Image, Box, Flex, Button, Icon} from "@chakra-ui/react"
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
        <Text borderBottomWidth='1px'>{props.location.name}</Text>
        <Flex mx='5px' marginTop='5px'>
          <Stack spacing='20px'>
            <Text textAlign={'justify'}>{props.location.description}</Text>  
            <HStack shouldWrapChildren={true} display='flex' overflowX='scroll'> 
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
                      fallbackSrc='https://www.resultae.com/wp-content/uploads/2018/07/reloj-100.jpg'
                      >
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
          </Stack>
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

  