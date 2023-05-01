import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure, Button, Icon
} from '@chakra-ui/react'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useSession } from '@inrupt/solid-ui-react';

export function LogoutAlertDialog() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const session = useSession()
  
    return (
      <>
        <Button colorScheme='red' 
                leftIcon={<Icon as={RiLogoutBoxLine}/>}
                size='lg'
                onClick={onOpen}
        >
          Logout
        </Button>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Logout
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure you want to log out?
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={() => {void session.logout(); window.location.reload()}} ml={3} leftIcon={<Icon as={RiLogoutBoxLine}/>}>
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }