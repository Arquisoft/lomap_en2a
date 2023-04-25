import React, {useEffect} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton, Text, Image,
} from '@chakra-ui/react'
import { useSession } from '@inrupt/solid-ui-react';
import images from "../../static/images/images";

export function IntroductionModalDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure({defaultIsOpen: true})
    const session = useSession()

    // const customSize = defineStyle({
    //     px: '6',
    //     py: '2',
    //     fontSize: 'sm'
    // })

    return (
      <>
        <Modal size={"4xl"} isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader fontSize='lg' fontWeight='bold'>
                Welcome to LoMap!
              </ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
                <Text>With LoMap you can access to a map and add markers, routes and share it with your friends.</Text>
                <Text paddingTop={'2em'}>You can find a tutorial inside the menu (click the sidebar at the left):</Text>
                <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
              </ModalBody>
  
              <ModalFooter>
                <Button colorScheme="blue" onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    )
  }