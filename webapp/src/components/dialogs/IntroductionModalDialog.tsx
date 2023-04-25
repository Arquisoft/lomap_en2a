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

    return (
      <>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader fontSize='lg' fontWeight='bold'>
                Welcome to LoMap!
              </ModalHeader>
  
              <ModalBody>
                <Text>With LoMap you can access to a map and add markers, routes and share it with your friends.</Text>
                <Image src={images.introDialogImg}></Image>
              </ModalBody>
  
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    )
  }