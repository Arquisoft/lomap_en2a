import { Text, Drawer, DrawerBody, DrawerCloseButton, Stack, StackDivider,
  DrawerContent, DrawerHeader, DrawerOverlay, HStack, Image, Box, Divider} from "@chakra-ui/react"



export function LocationView({isOpen, onClose, place}) : JSX.Element {  

  return (
    <Drawer placement='left' onClose={onClose} isOpen={isOpen} size='md'>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth='1px'>{place.name}</DrawerHeader>
        <DrawerBody mx='5px' marginTop='5px'>
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
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}

  