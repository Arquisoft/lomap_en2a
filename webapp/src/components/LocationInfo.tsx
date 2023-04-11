import React,{ useState,useEffect } from 'react';
import { Text,Stack, HStack, Image, Box, Flex, Button, Icon, Heading, Divider, useDisclosure, Textarea, Input, Grid, Progress} from "@chakra-ui/react"
import {MdOutlineRateReview} from 'react-icons/md'
import { Location} from "../../../restapi/locations/Location";
import {Review as ReviewType}  from "../../../restapi/locations/Location";
import {Popover,PopoverTrigger,PopoverContent,PopoverCloseButton, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup} from '@chakra-ui/react'
import {FormControl,FormLabel,FormErrorMessage,FormHelperText,} from '@chakra-ui/react'
import Review  from "./Review";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import noImage from '../no-pictures-picture.png';
import { useSession } from '@inrupt/solid-ui-react';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import {addLocationReview, addLocationScore, getNameFromPod } from '../solid/solidManagement';
import { DeletingAlertDialog } from './DeletingAlertDialog';
import { getSolidFriends, setAccessToFriend } from "../solid/solidManagement";
import type { Friend } from "../../../restapi/users/User";

type LocationInfoProps = {
  location : Location
  loadLocations: () => Promise<void>
};



const StarRating = ({ defaultValue = 0, onChange }) => {
  const [value, setValue] = useState(defaultValue);
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue) => {
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <HStack spacing={1} onMouseLeave={() => handleMouseLeave()}>
      {[1, 2, 3, 4, 5].map((i) => {
        let icon;
        if (i <= (hoverValue || value)) {
          icon = <Icon as={FaStar} color="yellow.500" />;
        } else if (i === Math.ceil(hoverValue) && !Number.isInteger(value)) {
          icon = <Icon as={FaStarHalfAlt} color="yellow.500" />;
        } else {
          icon = <Icon as={FaStar} color="gray.300" />;
        }
        return (
          <span
            key={i}
            onClick={() => handleClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
          >
            {icon}
          </span>
        );
      })}
    </HStack>
  );
};

const RatingSection = ({location, setLocation, session})=>{
  let localLocation = location;
  // variables to store the number of each rating
  const [one, setone] = useState(0)
  const [two, settwo] = useState(0)
  const [three, setthree] = useState(0)
  const [four, setfour] = useState(0)
  const [five, setfive] = useState(0)
  //for the total number or ratings
  const [total, settotal] = useState(100)
  //for the average of total reviews
  const [average, setaverage] = useState(0)

  useEffect(() => {
    computeStatistics();
  }, [location]);

  let computeStatistics = () => {
    //we reinitialize all the variables to 0 to recompute them
    let ones = 0,twos  = 0,threes = 0,fours = 0,fives = 0
    let totalLocal = 0;
    let avgLocal = 0;
    //we compute the number of reviews of each type
    if(location.ratings !== undefined)
      location.ratings.forEach((value,key,map) => {
        switch (value){
          case 1: ones++; break;
          case 2: twos++; break;
          case 3: threes++; break;
          case 4: fours++; break;
          case 5: fives++; break;
        }
        avgLocal += value;
        totalLocal++;
      });
    //we update the visual variables
    setone(ones);settwo(twos);setthree(threes);setfour(fours);setfive(fives);
    setaverage(avgLocal/totalLocal);
    settotal(totalLocal);
  };

  return (
    <>
      <Text as={'b'} fontSize={'x-large'} >Ratings</Text>
      <Grid templateRows={'repeat(2,1fr)'} >
        <Stack alignItems={'center'} gap='0em'>
          <Text>Give a rating to this location</Text>
          <StarRating
            defaultValue={
              location.ratings? //if we have ratings
                //if this user has rated
                (Array.from(location.ratings?.keys()).filter(key => key === (session as SessionInfo).session.info.webId)?
                  location.ratings.get((session as SessionInfo).session.info.webId)
                  :0/*if not rated*/
                )
                :0//if no ratings for the location
            }
            onChange={(value) => {
              //we add it to the location
              if (localLocation.ratings === undefined) {
                localLocation.ratings = new Map<string,number>();
              }
              localLocation.ratings.set(session.session.info.webId, value);
              setLocation(localLocation);
              //we update the visual part of the application
              computeStatistics()
              // solid management
              addLocationScore(session.session.info.webId, localLocation, value)

          }}></StarRating>
          <HStack gap='1.5em' placeContent={'center'} width={'full'}>
            <Stack alignItems={'center'}>
              <Text>Average rating:</Text>
              <Text data-testid ='avgRatings' as={'b'} fontSize='2xl'>{Number.isNaN(average)? 0 : average.toFixed(2)}</Text>
            </Stack>
            <Stack alignItems={'center'}>
              <Text>Number of ratings:</Text>
              <Text  data-testid ='nRatings' as={'b'} fontSize='2xl'>{total}</Text>
            </Stack>
          </HStack>
        </Stack>
        <Stack alignItems={'center'}>
          <Grid templateColumns={'repeat(2,1fr)'} gap='0.5vw' width={'full'}>
            <Stack>
              <Flex gap={'1em'} alignItems={'baseline'} direction={'row'}>
                <Text>1</Text>
                <Progress rounded={'md'} width={'full'} value={(one * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
              <Flex gap={'1em'} alignItems={'baseline'} direction={'row'}>
                <Text>2</Text>
                <Progress rounded={'md'} width={'full'} value={(two * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
            </Stack>
            <Stack>
              <Flex gap={'1em'} alignItems={'baseline'} direction={'row'}>
                <Text>3</Text>
                <Progress rounded={'md'} width={'full'} value={(three * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
              <Flex gap={'1em'} alignItems={'baseline'} direction={'row'}>
                <Text>4</Text>
                <Progress rounded={'md'} width={'full'} value={(four * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
            </Stack>
          </Grid>
          <Flex gap={'1em'} width={'14.5vw'} justifyContent='center' alignItems={'baseline'} direction={'row'}>
            <Text>5</Text>
            <Progress rounded={'md'} width={'full'} value={(five * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
          </Flex>

        </Stack>
      </Grid>
    </>
  )
};

const ReviewSection =  ( {location ,setLocation,session}) =>{
  const {isOpen, onOpen, onClose } = useDisclosure();
  const [title, settitle] = useState('')
  const [input, setInput] = useState('')
  const [username, setusername] = useState('')
  const firstFieldRef = React.useRef(null);
  let errorOnTitle = title.trim().length === 0;
  let errorOnBody = input.trim().length === 0;
  //we use a local version of the location because the passed one is the reference to the usestate one
  let localLocation = location;

  getNameFromPod(session.session.info.webId).then(res=> setusername(res));

  return (
    <>
      <Box >
        <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='top'
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Button data-testid ='buttonReview' colorScheme={'green'} size='sm' leftIcon ={<MdOutlineRateReview/>} >Add review</Button>
            </PopoverTrigger>
            <PopoverContent >
              <Box zIndex={'3'} padding='1.1em'>
              <PopoverCloseButton data-testid='closeButtonReview' />
                  <FormControl isInvalid={errorOnBody}  >
                    <FormLabel>Leave a review </FormLabel>
                    <FormLabel>Title</FormLabel>
                    <Input 
                      data-testid ='inputTitle'
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
                      data-testid ='inputBody'
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
                    <Button data-testid ='submitReviewButton'  marginLeft={'auto'} colorScheme={'teal'} disabled={errorOnBody || errorOnTitle}
                      onClick={()=>{
                        //create a new Review with the info of the current user
                        let review : ReviewType = {
                          title:title,
                          content:input,
                          date:new Date(),
                          webId : session.session.info.webId,
                          username: username
                        };
                        //we add it to the current location
                        if(localLocation.reviews === undefined){ //if no array we initialize it
                          localLocation.reviews = new Array<ReviewType>();
                        }
                        localLocation.reviews.push(review)

                        //we repaint the localLocation being showed
                        setLocation(localLocation)
                        //we persist the update on the Solid pod

                        // make call to the solidManagement module here
                        addLocationReview(localLocation, review)
                        //we close the add review window
                        onClose()
                      }}
                      >Submit review</Button>
                  </FormControl>
              </Box>
          </PopoverContent>
        </Popover>
      </Box>
      {
        localLocation.reviews?
          (localLocation.reviews as Array<ReviewType>)
            .sort((a : ReviewType,b : ReviewType)=> b.date.getTime() - a.date.getTime())
            .map((rev,i)=>(
              <Review
                key={i}
                title={rev.title as string}
                username={rev.username}//AKITOY
                content={rev.content as string}
                date={rev.date}/>
              ))
          :
          <Text>No reviews for this location, be the first one to leave one</Text>
      }
    </>
  )
}


export default function LocationInfo (props : LocationInfoProps) : JSX.Element { 
  const session = useSession();
  const webId = session.session.info.webId;
  const [location, setlocation] = useState(props.location)
  const [friends, setFriends] = React.useState<Friend[]>([]);
  let checkedFriends : string[] = [];

  React.useEffect(() => {
    handleFriends()
  }, [friends]);

  const handleFriends = async () => {
    if ( webId !== undefined && webId !== ""){
      const n  = await getSolidFriends(webId).then(friendsPromise => {return friendsPromise});
      setFriends(n);
    }
    else{
      // setFriends([]);
    }
  }

  const handleCheckedFriend = (e) => {
    // if the index is > -1, means the location was already shared with this friend
    const index = checkedFriends.indexOf(e.target.innerText); //use innerText to get the friend webID
    if (index > -1) {
        checkedFriends.splice(index, 1); // 2nd parameter means remove one item only
        // revoke the access to this location
        setAccessToFriend(e.target.innerText, location.url as string, false)
    }
    // if the index was not in the checkedFriends means that the user wants to share the location with this friend
    else{
        checkedFriends.push(e.target.innerText) // add friend
        // grant access to this location
        setAccessToFriend(e.target.innerText, location.url as string, true)
    }
}

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
        <HStack shouldWrapChildren={true} display='flex' overflowX='auto' minHeight={200}  height={'fit-content'}>
            {
            location.images?.length?
            (
              location.images?.map((image,i)=>{
                return (
                  <Image
                    key={i}
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
            <>
              <Text>
                No photos available for this location
              </Text>
              <Image
                src={noImage as string}
                width='180'
                height='180'
                borderRadius='lg'></Image>
            </>
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

          borderRadius='lg'
          >
          <Text
            textAlign={'justify'}
            margin='1.2em'>
              {location.description.trim().length > 0 ? location.description : 'No description for this location'}
          </Text>
        </Flex>

        <RatingSection location={location} setLocation={setlocation} session={session} ></RatingSection>

        <Flex
            direction={'row'}
            width='full'>
          <Text as={'b'} fontSize={'x-large'} >Reviews:</Text>
        </Flex>
        <ReviewSection location={location} setLocation={setlocation} session={session} ></ReviewSection>

        

      </Flex>
      <Box marginTop={'auto'} marginLeft='auto' marginEnd={'1em'}>
          <DeletingAlertDialog location={props.location} loadLocations={props.loadLocations}></DeletingAlertDialog>
        </Box>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} colorScheme='blue' minWidth='120px'>Share location with friends</MenuButton>
          <MenuList minWidth='240px'>
            <MenuOptionGroup type='checkbox'>
              {
                friends.map((friend) => {
                  return (
                      <MenuItemOption value={friend.webID} onClick={(e) => handleCheckedFriend(e)}
                      >{friend.webID}</MenuItemOption>
                  )
                })
              }
            </MenuOptionGroup>
          </MenuList>
        </Menu>
    </Flex>
  )
}