import { Text,Stack, HStack, Image, Box, Flex, Button, Icon, Heading, Divider, useDisclosure, Textarea, Input} from "@chakra-ui/react"
import {RxCross2}  from "react-icons/rx";
import {MdOutlineRateReview} from 'react-icons/md'
import { Location } from "../../../restapi/locations/Location";
import Review from "./Review";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import React,{useState} from "react";


type LocationInfoProps = {
  location : Location
  deleteLocation : (loc : Location) => void
};


const AddReview =  (onOpen,onClose,firstFieldRef)=>{
  const [input, setInput] = useState('')
  let isError = input.trim().length == 0;
  return (
    <Box marginLeft={'auto'}>
      <Popover
          isOpen={false}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement='right'
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button colorScheme={'green'} size='sm' leftIcon ={<MdOutlineRateReview/>} >Add review</Button>
          </PopoverTrigger>
          <PopoverContent>
            <FormControl isInvalid={isError}>
                <FormLabel>Email</FormLabel>
                <Textarea  value={input} onChange={(e) => setInput(e.target.value)} />
                {!isError ? 
                  <FormHelperText>This review will be stored on the location.</FormHelperText>
                  : 
                  <FormErrorMessage>Review is required.</FormErrorMessage>
                }
                <Button>Submit review</Button>
              </FormControl>
          </PopoverContent>
        </Popover>
      </Box>
  )
}


export default function LocationInfo (props : LocationInfoProps) : JSX.Element {  
  //variables used in the review addition popup
  const { onOpen, onClose } = useDisclosure();
  const firstFieldRef = React.useRef(null);

  return (
    <Flex
        direction={'column'}
        bg={'white'}
        width={"30vw"}
        height={"100vh"}
        position={'absolute'} 
        left={'5vw'}
        top={0}
        bottom={-4}
        zIndex={1}
        overflow='hidden'
        px={2}
        >
      <Heading
        fontSize='xx-large'
        as='b'  
        paddingLeft={'0.6em'}
        paddingBottom={'0.5em'} 
        >
        {props.location.name}
      </Heading>

      <Divider borderWidth={'0.18em'} borderColor='black'  borderRadius={"lg"} width='20em' />
      <Flex
        direction={'column'}
        overflowY='auto'>

        <Text as='b'fontSize={'x-large'}>Pictures:</Text>
        <HStack shouldWrapChildren={true} display='flex' overflowX='auto' height={'fit-content'}> 
            {
            props.location.images?.length? 
            (
              props.location.images?.map((image)=>{
                return (
                  <Image 
                    src={image as string} 
                    width='200'
                    height='200'
                    borderRadius='lg'
                    fallbackSrc='https://www.resultae.com/wp-content/uploads/2018/07/reloj-100.jpg'>
                  </Image>
                )
              })   
            ) 
            : 
            <Text>
              No photos available for this location
            </Text>
            }
          </HStack>


        <Text as={'b'} fontSize={'x-large'} >Description:</Text>
        <Flex
          direction={'column'}
          overflowY='auto'
          marginBottom='1.05em'
          maxHeight={'30vh'}
          minHeight='15vh'
          bgColor='blackAlpha.200'
          border={"1px"}
          borderRadius='lg'
          >
          <Text 
            textAlign={'justify'}
            margin='1.2em'>
              {props.location.description.trim().length > 0 ? props.location.description : 'No description for this location'}
          </Text>  
        </Flex>

        <Flex
            direction={'row'}
            width='full'>
          <Text as={'b'} fontSize={'x-large'} >Reviews:</Text>
          <AddReview onOpen={onOpen} onClosed={onClose} firstFieldRef={firstFieldRef}></AddReview>
        </Flex>
        
        {
          props.location.review?
            props.location.review.map((rev,i)=>{
              <Review title={rev.title as string} username={rev.username as string} content={rev.content as string} date={rev.date}/>
              })
            :
            <Text>No reviews for this location.</Text>
        }

        <Review title="Review1-->delete" username="monkey" content="This is the content of the review" date= {new Date()}/>
        
        

      </Flex>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
        <Button colorScheme='red' leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
          size='lg'
          onClick={() => {
            //we delete the props.location that is being showed
            props.deleteLocation(props.location);
          }}
        >
          Delete location
        </Button>
      </Box>
    </Flex>
  )
}
  