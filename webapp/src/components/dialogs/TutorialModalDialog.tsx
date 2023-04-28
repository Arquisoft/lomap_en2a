import React, {useEffect, useState} from "react";
import {
    useDisclosure,
    Button,
    Icon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton, Text, Image, Divider, SlideFade, Flex, UnorderedList, ListItem, Link, Fade,
} from '@chakra-ui/react'
import { useSession } from '@inrupt/solid-ui-react';
import images from "../../static/images/images";
import {MdQuestionMark} from "react-icons/md";
import './TutorialModalDialog.css';

export function TutorialModalDialog(props:any) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => {
        if (currentPage + 1 <= 5)
            setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage - 1 > 0)    // validation because better safe than sorry
            setCurrentPage(currentPage - 1);
    };

    const moveToPage = (page) => {
        if (page >= 1 || page <= 5)
            setCurrentPage(page);
    };

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

        <Modal size={"5xl"} isCentered isOpen={isOpen} onClose={onClose} scrollBehavior={'inside'}>
          <ModalOverlay>
              <ModalContent height={'90%'} padding={'1em 1em 0 1em'}>
                {(currentPage === 1) && (
                    <>
                        <ModalHeader fontSize='3xl' fontWeight='bold'>
                            <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                            <Text >Tutorial - Introduction</Text>
                            <Divider></Divider>
                        </ModalHeader>
                        <ModalCloseButton/>


                        <ModalBody>
                            <Text><b>Welcome to LoMap!</b></Text>

                            <Text>In this tutorial you will learn the basics of LoMap.</Text>
                            <Text marginTop={"1em"}>
                                Click one of the following links to navigate to that page:
                            </Text>
                            <UnorderedList>
                                <ListItem>
                                    <Link color={"blue.500"} onClick={()=>moveToPage(2)}>Map View</Link>
                                </ListItem>
                                <ListItem>
                                    <Link color={"blue.500"} onClick={()=>moveToPage(3)}>List of Locations</Link>
                                </ListItem>
                                <ListItem>
                                    <Link color={"blue.500"} onClick={()=>moveToPage(4)}>Add Location</Link>
                                </ListItem>
                                <ListItem>
                                    <Link color={"blue.500"} onClick={()=>moveToPage(5)}>Add Friends</Link>
                                </ListItem>
                            </UnorderedList>

                        </ModalBody>

                        <ModalFooter>
                            <Flex className={'modal-footer'}>
                                <button className={"prevBtn"} onClick={prevPage} disabled> &#10094; </button>

                                <span className={"page active"} onClick={() => setCurrentPage(1)} > · </span>
                                <span className={"page"} onClick={() => setCurrentPage(2)}> · </span>
                                <span className={"page"} onClick={() => setCurrentPage(3)}> · </span>
                                <span className={"page"} onClick={() => setCurrentPage(4)}> · </span>
                                <span className={"page"} onClick={() => setCurrentPage(5)}> · </span>

                                <button className={"nextBtn"} onClick={nextPage} > &#10095; </button>
                            </Flex>
                        </ModalFooter>
                    </>
                )}
              {(currentPage === 2) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - Map View </Text>
                          <Divider></Divider>
                      </ModalHeader>
                      <ModalCloseButton/>

                      <ModalBody>

                          <Text>
                            In the <b>Map View</b> you will be able to see the map with all the locations you and
                            your friends created.
                          </Text>
                          <Text marginTop={"1em"} >
                              <b>You can add a location easily!</b>
                          </Text>
                          <Image src={images.addingLocationFromMapView} marginTop={'0.5em'} border={'black solid 0.1em'} ></Image>

                          <Text marginTop={"2em"} >
                              <b>Filter your locations to find what you want faster!</b>
                          </Text>
                          <Text>
                              While creating a location you can assign categories to it. These are very useful to keep your collection well organized.
                              But that's not all: you can also use LoMap's filter system.
                          </Text>
                          <Image src={images.usingFilters} marginTop={'0.5em'} border={'black solid 0.1em'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex className={'modal-footer'}>
                              <button className={"prevBtn"} onClick={prevPage}> &#10094; </button>

                              <span className={"page"} onClick={() => setCurrentPage(1)}> · </span>
                              <span className={"page active"} onClick={() => setCurrentPage(2)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(3)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(4)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(5)}> · </span>

                              <button className={"nextBtn"} onClick={nextPage} > &#10095; </button>
                          </Flex>
                      </ModalFooter>
                  </>
              )}
              {(currentPage === 3) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - List of Locations </Text>
                          <Divider></Divider>
                      </ModalHeader>
                      <ModalCloseButton/>

                      <ModalBody>
                          <Text>In the <b>List of Locations</b> you can find all your saved locations and the locations your friends share with you.</Text>
                          <Text marginTop={"1em"}>
                              <b>Click a location to open the detailed view.</b>
                          </Text>
                          <Text>You can leave comments and give a rating to the locations.</Text>
                          <Text>You can share your own locations with your friends. They will be able to see them, and also comment and rate them!</Text>

                          <Image src={images.listOfLocationsTutorial} marginTop={'0.5em'} border={'black solid 0.1em'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex className={'modal-footer'}>
                              <button className={"prevBtn"} onClick={prevPage}> &#10094; </button>

                              <span className={"page"} onClick={() => setCurrentPage(1)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(2)}> · </span>
                              <span className={"page active"} onClick={() => setCurrentPage(3)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(4)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(5)}> · </span>

                              <button className={"nextBtn"} onClick={nextPage} > &#10095; </button>
                          </Flex>
                      </ModalFooter>
                  </>
              )}
              {(currentPage === 4) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - Add Location </Text>
                          <Divider></Divider>
                      </ModalHeader>
                      <ModalCloseButton/>

                      <ModalBody>
                          <Text>
                            In LoMap, you can easily save your favourite locations.
                          </Text>

                          <Text marginTop={'1em'}><b>Add locations to your list</b></Text>
                          <Text>
                            A LoMap location requires a <b>name</b> and <b>coordinates</b>.
                          </Text>
                          <Text>
                              You can manually set the coordinates or you can just click wherever you want to add a new location and they will be automatically set.
                          </Text>

                          <Text marginTop={'1em'}><b>Additional information</b></Text>
                          <Text>
                              Optionally, you can give your location one or more <b>categories</b>, set a <b>description</b> and add <b>images</b>.
                          </Text>
                          <Text marginTop={'1em'}>
                              Once the location is added, you will see it in the
                              <Link color={"blue.500"} onClick={()=>moveToPage(3)}> List of Locations</Link>.
                          </Text>

                          <Image src={images.addLocationTutorial} marginTop={'1.5em'} border={'black solid 0.1em'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex className={'modal-footer'}>
                              <button className={"prevBtn"} onClick={prevPage}> &#10094; </button>

                              <span className={"page"} onClick={() => setCurrentPage(1)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(2)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(3)}> · </span>
                              <span className={"page active"} onClick={() => setCurrentPage(4)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(5)}> · </span>

                              <button className={"nextBtn"} onClick={nextPage} > &#10095; </button>
                          </Flex>
                      </ModalFooter>
                  </>
              )}
              {(currentPage === 5) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - Add Friends </Text>
                      </ModalHeader>
                      <ModalCloseButton/>
                      <Divider></Divider>
                      <ModalBody>
                          <Text><b>How can you add friends?</b></Text>
                          <Text>LoMap is an application that operates with Solid.</Text>
                          <Text>
                              You just need your friends' Solid WebID, and then add them as your friends. To make your friendship official,
                              give to your friends your own WebID and when they add you, you will become officially friends!
                          </Text>

                          <Text marginTop={'1em'}><b>Friends? Why?</b></Text>
                          <Text>Having friends is nice! Once you have friends in LoMap, you can share locations, leave comments and rate your locations.</Text>

                          <Image src={images.addFriendsTutorial} marginTop={'1em'} border={'black solid 0.1em'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex className={'modal-footer'}>
                              <button className={"prevBtn"} onClick={prevPage}> &#10094; </button>

                              <span className={"page"} onClick={() => setCurrentPage(1)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(2)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(3)}> · </span>
                              <span className={"page"} onClick={() => setCurrentPage(4)}> · </span>
                              <span className={"page active"} onClick={() => setCurrentPage(5)}> · </span>

                              <button className={"nextBtn"} onClick={nextPage} disabled> &#10095; </button>
                          </Flex>
                      </ModalFooter>
                  </>
              )}

              </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    )
  }