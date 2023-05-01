import React,{ useState,useEffect } from 'react';
import { Text, Stack, HStack, Image, Box, Flex, Button, Icon, Divider, useDisclosure, Textarea, Input, Grid, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, CloseButton, useToast} from "@chakra-ui/react"
import {MdOutlineRateReview, MdShare} from 'react-icons/md'

import {Popover,PopoverTrigger,PopoverContent,PopoverCloseButton, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup} from '@chakra-ui/react'
import {FormControl,FormLabel,FormErrorMessage,FormHelperText,} from '@chakra-ui/react'
import Review  from "./Review";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import images from '../../static/images/images'
import { useSession } from '@inrupt/solid-ui-react';
import { SessionInfo } from '@inrupt/solid-ui-react/dist/src/hooks/useSession';
import {addLocationReview, addLocationScore, getNameFromPod } from '../../solid/solidManagement';
import { DeletingAlertDialog } from '../dialogs/DeletingLocationAlertDialog'
import { getSolidFriends, setAccessToFriend } from "../../solid/solidManagement";
import type { Friend ,Location, Review as ReviewType} from "../../types/types";
import CategoriesBubble from './CategoriesBubbles';

type LocationInfoProps = {
  location : Location
  loadLocations: () => Promise<void>
  setSelectedView: (viewName: string) => void //function to change the selected view on the left
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
    <HStack spacing={1} onMouseLeave={() => handleMouseLeave()} cursor={'pointer'}>
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
      <Grid templateRows={'repeat(2,1fr)'} >
        <Stack alignItems={'center'} gap='0%'>
          <Text fontSize='1.2em'>Give a rating to this location</Text>
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
          <HStack gap='10%' placeContent={'center'} width={'full'}>
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
          <Grid templateColumns={'repeat(2,1fr)'} gap='5%' width={'full'}>
            <Stack>
              <Flex gap={'3%'} alignItems={'baseline'} direction={'row'}>
                <Text>1</Text>
                <Progress rounded={'md'} width={'full'} value={(one * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
              <Flex gap={'3%'} alignItems={'baseline'} direction={'row'}>
                <Text>2</Text>
                <Progress rounded={'md'} width={'full'} value={(two * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
            </Stack>
            <Stack>
              <Flex gap={'3%'} alignItems={'baseline'} direction={'row'}>
                <Text>3</Text>
                <Progress rounded={'md'} width={'full'} value={(three * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
              <Flex gap={'3%'} alignItems={'baseline'} direction={'row'}>
                <Text>4</Text>
                <Progress rounded={'md'} width={'full'} value={(four * 100) / total} size='sm' colorScheme={'yellow'}></Progress>
              </Flex>
            </Stack>
          </Grid>
          <Flex gap={'3%'} width={'60%'} justifyContent='center' alignItems={'baseline'} direction={'row'}>
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
  //we get the name of the user
  useEffect(() => {
    if(session.session.info.webId)
      getNameFromPod(session.session.info.webId).then(res=> setusername(res));

  }, []);
  return (
    <>
      <Box marginLeft={'10%'}>
        <Popover
            isOpen={isOpen}
            initialFocusRef={firstFieldRef}
            onOpen={onOpen}
            onClose={onClose}
            placement='bottom'
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <Button data-testid ='add-review-button' colorScheme={'green'} size='sm' leftIcon ={<MdOutlineRateReview/>} >Add review</Button>
            </PopoverTrigger>
            <PopoverContent >
              <Box padding='6%' marginLeft='5%'>
              <PopoverCloseButton data-testid='closeButtonReview' />
                  <FormControl isInvalid={errorOnBody}  >
                    <FormLabel fontSize={'1.6em'}>Leave a review</FormLabel>
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
                    <Button data-testid ='submitReviewButton' mt='2%' marginLeft={'auto'} colorScheme={'teal'} disabled={errorOnBody || errorOnTitle}
                      onClick={()=>{
                        //create a new Review with the info of the current user
                        let review : ReviewType = {
                          title:title,
                          content:input,
                          date:new Date().toISOString(),
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
      <Flex mx={'4%'} maxHeight={'sm'} direction={'column'}>
      {
        localLocation.reviews?.length > 0?  
          (localLocation.reviews as Array<ReviewType>)
          .sort((a : ReviewType,b : ReviewType)=>new Date( b.date).getTime() - new Date(a.date).getTime())
          .map((rev,i)=>{return (
          <Review
            key={i}
            title={rev.title as string}
            username={rev.username}
            webId={rev.webId}
            content={rev.content as string}
            date={rev.date}/>
            )})
          :
          <Text marginTop='2%'>There aren't any reviews for this location... Be the first to leave one!</Text>
      }
      </Flex>
    </>

  )
}


export default function LocationInfo (props : LocationInfoProps) : JSX.Element { 
  const session = useSession();
  const webId = session.session.info.webId;
  const [location, setlocation] = useState(props.location)
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const colors = ['teal', 'purple', 'pink', 'blue', 'green', 'orange'];

  // make this information persistent even when the user closes this panel
  const [checkedFriends, setCheckedFriends] = React.useState<string[]>(
    () => JSON.parse(localStorage.getItem("checkedFriends") || "[]")
  );
  
  React.useEffect(() => {
    localStorage.setItem("checkedFriends", JSON.stringify(checkedFriends));
  }, [checkedFriends]);
  

  const [friendsChargingMsg, setFriendChargingMsg] = useState("Loading...")
  const toastShared = useToast();


  React.useEffect(() => {
    handleFriends()
  }, []); 

  const handleFriends = async () => {
    if ( webId !== undefined && webId !== ""){
      const n  = await getSolidFriends(webId).then(friendsPromise => {return friendsPromise});
      if (n.length == 0)
        setFriendChargingMsg("Add a friend to share the location!")
      setFriends(n);
    }
    else{
      setFriends([]);
    }
  }

  const handleCheckedFriend = (e) => {
    // if the index is > -1, means the location was already shared with this friend
    const friendWebID = e.target.innerText;
    const index = checkedFriends.indexOf(friendWebID);
    const friendUsername = friends.find(friend => friend.webID == friendWebID) as Friend;
    if (index > -1) {
      const newCheckedFriends = checkedFriends.filter((friend) => friend !== friendWebID);
      setCheckedFriends(newCheckedFriends);
      setAccessToFriend(friendWebID, location.url as string, false);
      toastShared({
        title: `Location is no longer shared with ${friendUsername.username}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const newCheckedFriends = [...checkedFriends, friendWebID];
      setCheckedFriends(newCheckedFriends);
      setAccessToFriend(friendWebID, location.url as string, true);
      toastShared({
        title: `Location shared with ${friendUsername.username}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Flex
        direction={'column'}
        bg={'white'}
        width={"30%"}
        height={"100%"}
        position={'absolute'} 
        left={'3%'}
        top={0}
        bottom={-4}
        zIndex={1}
        overflowY='auto'
        overflowX='hidden'
        px={2}
        paddingBottom={'15%'}
        >
          <Flex direction='row' gap='8%' marginLeft='auto' marginRight='3%' marginTop='2%'>
            <CloseButton 
                    onClick={() => props.setSelectedView('Map')}
            ></CloseButton>
          </Flex>
          <Flex direction='row' marginLeft='5%'width='90%' >
            <Text
              word-wrap="break-word"
              fontSize='2.2em'
              width='70%'
              marginLeft={'5%'}
              >
              {location.name} 
            </Text>
            <Flex direction='row' marginLeft='auto' marginEnd='4%' gap='5%'>
              <DeletingAlertDialog location={props.location} loadLocations={props.loadLocations}  setSelectedView={props.setSelectedView}></DeletingAlertDialog>
              <Menu closeOnSelect={false}>
                <MenuButton as={Button} colorScheme='blue' 
                  width='fit-content'>
                    <Icon as={MdShare}/>
                </MenuButton>
                <MenuList minWidth='100%'>
                  {
                    friends.length > 0 ? 
                    <MenuOptionGroup type='checkbox' value={checkedFriends}> 
                      {
                        friends.map((friend,i) => {
                          return (
                              <MenuItemOption key={i} value={friend.webID} onClick={(e) => handleCheckedFriend(e)}
                              >{friend.webID}</MenuItemOption>
                          )
                        })
                      }
                    </MenuOptionGroup> 
                    :
                    <Text>{friendsChargingMsg}</Text>
                  }
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <CategoriesBubble location={location}></CategoriesBubble>
          <Divider marginTop={'2%'} borderWidth={'2px'} borderRadius={"lg"} width='100%' />

          <Text marginLeft='10%' fontSize={'1.6em'} >Description:</Text>
          <Flex
            direction={'column'}
            overflowY='auto'
            marginBottom='1%'
            maxHeight={'30%'}
            minHeight='15%'
            bgColor='blackAlpha.50'
            marginLeft='10%'
            marginRight={'2%'}
            borderRadius='lg'
            >
            <Text
              textAlign={'justify'}
              marginLeft='3%'
              marginTop='2%'>
                {location.description.trim().length > 0 ? location.description : 'No description for this location'}
            </Text>
          </Flex>

      <Divider marginTop={'2%'} borderWidth={'2px'} borderRadius={"lg"} width='100%'/>
      <Flex
        direction={'column'}
        width={'100%'}>
        {
        location.images?.length?
        (
          <HStack marginTop='2%' marginLeft={'9%'} shouldWrapChildren={true} overflowY='auto'
                  display='flex' overflowX='auto' minHeight={200}  height={'fit-content'} paddingRight='4%'>
            {location.images?.map((image,i)=>{
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
              })}
          </HStack>
        )
        :
        <Flex marginLeft={'10%'} direction={'row'} alignItems={'center'} >
          <Image
            src={images.noPicture}
            width='100'
            height='100'
            borderRadius='lg'></Image>
            <Text marginLeft='4%' width='100%'>No photos available for this location</Text>
        </Flex>
        }
          
      </Flex>

      <Divider marginTop={'2%'} marginBottom={'2%'} borderWidth={'2px'} borderRadius={"lg"} width='100%'/> 
        <Tabs isFitted={true} variant='enclosed' mx='5%' marginLeft='5%'>
          <TabList>
            <Tab data-testid="review-button">Reviews</Tab>
            <Tab data-testid="rating-button">Ratings</Tab>
          </TabList>
          <TabPanels alignSelf='center'>
            <TabPanel >
              <ReviewSection  location={location} setLocation={setlocation} session={session} ></ReviewSection>
            </TabPanel>
            <TabPanel>
              <RatingSection location={location} setLocation={setlocation} session={session} ></RatingSection>
            </TabPanel>
          </TabPanels>
        </Tabs>
    </Flex>
  )
}