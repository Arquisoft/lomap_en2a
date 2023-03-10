import { Image, Button, Text, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, useDisclosure, VStack, Box } from "@chakra-ui/react"
import React from "react"

export function ProfileView() {
    const { isOpen, onOpen, onClose } = useDisclosure()
  
    return (
      <>
        <Button colorScheme='blue' onClick={onOpen} style={{"position":"absolute", "left":"0", "bottom":"0"}}>
          Open
        </Button>
        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>Profile Information</DrawerHeader>
            <DrawerBody>
              <VStack>
                  <Image
                  borderRadius='full' //redondeados
                  boxSize='150px'
                  src='https://bit.ly/dan-abramov' // imagen por defecto
                  alt='Dan Abramov'
                  />
                  <p style={{"fontSize":"1.2em"}}>Dan Abramov</p>
                </VStack>
                <Box p={2} shadow='md' borderWidth='1px'>
                  <Text as="b">User information</Text>
                  <Text>198 Locations</Text>
                  <Text>199987624 Reviews</Text>
                </Box>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }