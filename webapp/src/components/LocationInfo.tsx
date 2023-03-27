import { Text, Drawer, DrawerBody, DrawerCloseButton, Stack, 
  DrawerContent, DrawerHeader, DrawerOverlay, HStack, Image } from "@chakra-ui/react"


/**
 * Panel to view the location information
 * @param param place contains the location to show
 * @returns renderized component
 */
export function LocationInfo({isOpen, onClose, place}) : JSX.Element {  

  return (
    <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>
          {
            place.name != "" && place.name != null ? place.name : "No name"
          }
          </DrawerHeader>
        <DrawerBody mx='5px' marginTop='5px'>
          <Stack spacing='20px'>
            <Text textAlign={'justify'}>
            {
              place.description != "" && place.description != null ? place.description : "No description"
            }</Text>  
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

  