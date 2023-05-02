import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure, Button, Icon, useToast, Spinner
} from '@chakra-ui/react'
import {RiLogoutBoxLine} from 'react-icons/ri'
import { useSession } from '@inrupt/solid-ui-react';

export function LogoutAlertDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
    const session = useSession()
  
    return (
      <>
        <Button colorScheme='red' 
                leftIcon={<Icon as={RiLogoutBoxLine}/>}
                size='lg'
                onClick={onOpen}
          data-testid="logout"
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
  
              <AlertDialogBody data-testid="info-dialog">
                Are you sure you want to log out?
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button onClick={onClose} data-testid="cancel-button">
                  Cancel
                </Button>
                <Button data-testid="logout-button"
                colorScheme='red' onClick={() => {session.logout(); window.location.reload()}} ml={3} leftIcon={<Icon as={RiLogoutBoxLine}/>}>
                  Logout
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }