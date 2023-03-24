import { Text, Drawer, DrawerBody, DrawerCloseButton, Stack, StackDivider,
  DrawerContent, DrawerHeader, DrawerOverlay, HStack, Image, Box, Divider, Flex} from "@chakra-ui/react"



export default function LocationView({place}) : JSX.Element {  

  return (
    <Flex
          direction={'column'}
          bg={'white'}
          width={"30vw"}
          height={"100vh"}
          position={'absolute'} 
          left={'5vw'}
          top={0}
          zIndex={1}
          overflow='hidden'
          px={2}
          >
        <Text borderBottomWidth='1px'>{place.name}</Text>
        <Flex mx='5px' marginTop='5px'>
          <Stack spacing='20px'>
            <Text textAlign={'justify'}>{place.description}</Text>  
            <HStack shouldWrapChildren={true} display='flex' overflowX='scroll'> 
            {
              place.images?.length != null ? 
              (
                place.images?.map((image)=>{
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
    </Flex>
  )
}

  