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
import {MdQuestionMark} from "react-icons/md";

export function TutorialModalDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const session = useSession()

    return (
      <>
        <Button data-testid={'Tutorial'}
                leftIcon={<Icon as={MdQuestionMark} width={'2.5em'} height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
                bg={'white'}
                color={'black'}
                size='lg'
                onClick={onOpen}
        >
            Tutorial
        </Button>

        <Modal size={"4xl"} isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
            <ModalContent>
              <ModalHeader fontSize='lg' fontWeight='bold'>
                Tutorial
              </ModalHeader>
              <ModalCloseButton/>
              <ModalBody>
                <Text>The tutorial test will be here.</Text>

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