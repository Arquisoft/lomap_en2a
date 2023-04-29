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
import {MdDelete} from 'react-icons/md'
import {deleteLocation} from "../../solid/solidManagement";
import {useSession} from "@inrupt/solid-ui-react";
import { Location } from "../../types/types";



export function DeletingAlertDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef:any = React.useRef();
    const session = useSession();
    const toast = useToast();
    const [disabled, setDisabled] = React.useState(false);
    const [deleteIcon, setDeleteIcon] = React.useState(<></>)

    function deleteLoc(location: Location) {
        setDisabled(true)
        setDeleteIcon(<Spinner size={"xs"}/>)
        if(session.session.info.webId && location.url)
            deleteLocation(session.session.info.webId ,location.url.toString()).then(
                ()=> {
                    props.loadLocations().then(
                        () => toast({
                            title: 'Location deleted.',
                            description: "The location was deleted from your pod.",
                            status: 'success',
                            duration: 15000,
                            isClosable: true,
                        })
                    );
                    setDisabled(false)
                    onClose()
                    props.setSelectedView('Map')
                },
                ()=> {
                    toast({
                        title: 'Error while deleting.',
                        description: "The location couldn't be deleted from your pod.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                    setDisabled(false)
                    onClose()
                }
            ) 
    }


    return (
        <>
            <Button 
                colorScheme='red'
                onClick={onOpen}
                size='md'
                marginBottom={'6%'}
                width='fit-content'>
                <Icon as={MdDelete}/>
            </Button>

            <AlertDialog leastDestructiveRef={cancelRef}
                         isOpen={isOpen}
                         onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Location
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this location?
                            <p>This action can't be undone.</p>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red'
                                onClick={()=> {
                                    deleteLoc(props.location);
                                }}
                                leftIcon={deleteIcon}
                                isDisabled={disabled}
                                ml={3}>
                                Delete
                            </Button>

                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}