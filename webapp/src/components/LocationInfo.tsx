import { Text,Stack, HStack, Image, Box, Flex } from "@chakra-ui/react"
import { Location } from "../../../restapi/locations/Location";
import { DeletingAlertDialog } from './DeletingAlertDialog';


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
        borderRight={"1px solid black"}
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
          <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'} paddingBottom={'1em'}>

            <DeletingAlertDialog
                deleteLocation={props.deleteLocation}
                location={props.location}
            ></DeletingAlertDialog>
          </Box>
    </Flex>
  )
}

  