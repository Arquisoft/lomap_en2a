import React from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure, Button, Icon, useToast
} from '@chakra-ui/react'
import {RxCross2} from "react-icons/rx";


export function DeletingAlertDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef:any = React.useRef();

    const toast = useToast();

    return (
        <>
            <Button colorScheme='red'
                    onClick={onOpen}
                    size='lg'
                    leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'}/>}
            >
                Delete location
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
                                    onClick={async ()=> {
                                        await props.deleteLocation(props.location);
                                        await onClose();
                                        await toast({
                                            title: 'Location deleted.',
                                            description: "The location was deleted from your pod.",
                                            status: 'success',
                                            duration: 5000,
                                            isClosable: true,
                                        });
                                    }}
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