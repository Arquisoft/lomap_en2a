import { Text,Stack, HStack, Image, Box, Flex, Button, Icon} from "@chakra-ui/react"
import {RxCross2}  from "react-icons/rx";
import { deleteLocation } from "../solid/solidManagement";



export default function LocationInfo({location, session}) : JSX.Element {  

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
        <Text borderBottomWidth='1px'>{location.name}</Text>
        <Flex mx='5px' marginTop='5px'>
          <Stack spacing='20px'>
            <Text textAlign={'justify'}>{location.description}</Text>  
            <HStack shouldWrapChildren={true} display='flex' overflowX='scroll'> 
            {
              location.images?.length != null ? 
              (
                location.images?.map((image)=>{
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
          </Stack>
          </Flex>
          <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
            <Button colorScheme='red' leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
              size='lg'
              onClick={() => {
                //we delete the location that is being showed
                deleteLocation(session.session.info.webId, location.url);
              }}
            >
              Delete location
            </Button>
          </Box>
    </Flex>
  )
}

  