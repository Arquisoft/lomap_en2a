import React,{ useState,useEffect } from 'react';
import { Text,Stack, HStack, Image, Box, Flex, Button, Icon, Heading, Divider, useDisclosure, Textarea, Input} from "@chakra-ui/react"
import {RxCross2}  from "react-icons/rx";
import {MdOutlineRateReview} from 'react-icons/md'
import { Location} from "../../../restapi/locations/Location";
import {Review as ReviewType}  from "../../../restapi/locations/Location";


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
import Review  from "./Review";


type LocationInfoProps = {
  location : Location
  deleteLocation : (loc : Location) => void
};

const AddReview =  ( {location ,setLocation}) =>{
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [title, settitle] = useState('')
  const [input, setInput] = useState('')
  const firstFieldRef = React.useRef(null);
  let errorOnTitle = title.trim().length == 0;
  let errorOnBody = input.trim().length == 0;
  //we use a local version of the location because the passed one is the reference to the usestate one
  let localLocation = JSON.parse(JSON.stringify(location)); 
  return (
    <Box marginLeft={'auto'} >
      <Popover
          isOpen={isOpen}
          initialFocusRef={firstFieldRef}
          onOpen={onOpen}
          onClose={onClose}
          placement='top'
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Button colorScheme={'green'} size='sm' leftIcon ={<MdOutlineRateReview/>} >Add review</Button>
          </PopoverTrigger>
          <PopoverContent >
            <Box zIndex={'3'} padding='1.1em'>
            <PopoverCloseButton />
                <FormControl isInvalid={errorOnBody}  >
                  <FormLabel>Leave a review </FormLabel>
                  <FormLabel>Title</FormLabel>
                  <Input 
                    ref={firstFieldRef}
                    value={title}
                    onChange={(e:any) => settitle(e.target.value)}                                        
                    placeholder='Title of review'/>

                  {!errorOnTitle ? 
                    <FormHelperText>Give a descriptive title to the review</FormHelperText>
                    : 
                    <FormErrorMessage>Review must have a title</FormErrorMessage>
                  }
                  <FormLabel>Body</FormLabel>
                  <Textarea
                    placeholder="Body of the review"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    overflowY='auto'
                    resize={'none'}/>
                  {!errorOnBody ? 
                    <FormHelperText>Give a descriptive review body</FormHelperText>
                    : 
                    <FormErrorMessage>Body of the review is required</FormErrorMessage>
                  }
                  <Button marginLeft={'auto'} colorScheme={'teal'} disabled={errorOnBody || errorOnTitle}
                    onClick={()=>{
                      //create a new Review with the info of the current user
                      let review : ReviewType = {
                        username:'TODO', //TODO
                        title:title,
                        content:input,
                        date:new Date(),
                        webId : 'TODO' //TODO 
                      };
                      //we add it to the current location 
                      if(localLocation.reviews) //if already have reviews push
                        localLocation.reviews.push(review)
                      else{ //if this is the first review create array and push
                        localLocation.reviews = new Array<ReviewType>();
                        localLocation.reviews.push(review)
                      }
                      //we repaint the localLocation being showed
                      setLocation(localLocation)
                      //we persist the update on the Solid pod

                      //TODO make call to the solidManagement module here

                      //we close the add review window
                      onClose()
                    }}
                    >Submit review</Button>
                </FormControl>
            </Box>
        </PopoverContent>
      </Popover>
    </Box>
  )
}


export default function LocationInfo (props : LocationInfoProps) : JSX.Element {  
  const [location, setlocation] = useState(props.location)

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
        {location.name}
      </Heading>

      <Divider borderWidth={'0.18em'} borderColor='black'  borderRadius={"lg"} width='20em' />
      <Flex
        direction={'column'}
        overflowY='auto'>

        <Text as='b'fontSize={'x-large'}>Pictures:</Text>
        <HStack shouldWrapChildren={true} display='flex' overflowX='auto' height={'fit-content'}> 
            {
            location.images?.length? 
            (
              location.images?.map((image)=>{
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
              {location.description.trim().length > 0 ? location.description : 'No description for this location'}
          </Text>  
        </Flex>

        <Flex
            direction={'row'}
            width='full'>
          <Text as={'b'} fontSize={'x-large'} >Reviews:</Text>
          <AddReview location={location} setLocation={setlocation} ></AddReview>
        </Flex>
        
        {
          location.reviews?
          location.reviews.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime()).map((rev,i)=>(
              <Review title={rev.title as string} username={rev.username as string} content={rev.content as string} date={rev.date}/>
              ))
            :
            <Text>No reviews for this location</Text>
        }
        <Button onClick={()=> {/*TODO delete this when fixed order*/console.log(location.reviews?.sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime())); location.reviews?.forEach(r=> console.log(new Date(r.date).getTime()))}}></Button>


      </Flex>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
        <Button colorScheme='red' leftIcon={<Icon as={RxCross2} width='max-content' height={'2.5vw'} minHeight={'10px'} minWidth={'10px'} />}
          size='lg'
          onClick={() => {
            //we delete the location that is being showed
            props.deleteLocation(location);
          }}
        >
          Delete location
        </Button>
      </Box>
    </Flex>
  )
}
  