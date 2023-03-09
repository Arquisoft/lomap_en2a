import { Image, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Radio, RadioGroup, Stack, useDisclosure } from "@chakra-ui/react"
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
                <Image
                borderRadius='full' //redondeados
                boxSize='100px'
                src='https://bit.ly/dan-abramov' // imagen por defecto
                alt='Dan Abramov'
                />
                <p>Name and Surname</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }