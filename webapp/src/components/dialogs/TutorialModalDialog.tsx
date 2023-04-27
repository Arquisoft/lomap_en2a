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

        setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage - 1 > 0)    // validation because better safe than sorry
            setCurrentPage(currentPage - 1);
    };

    const moveToPage = (page) => {
        if (page >= 1 || page < 10)
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

        <Modal size={"5xl"} isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay>
              <ModalContent height={'90%'} overflowY={'auto'} padding={'1em'}>
                {(currentPage === 1) && (
                    <>
                        <ModalHeader fontSize='3xl' fontWeight='bold'>
                            <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                            <Text >Tutorial - Introduction</Text>
                            <Divider></Divider>
                        </ModalHeader>
                        <ModalCloseButton/>


                        <ModalBody>
                            <Text>Welcome to LoMap!</Text>

                            <Text>In this tutorial we will teach you the basics of LoMap.</Text>
                            <Text>Click one of the following links to navigate to that page:</Text>
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
                            <Flex justifyContent={"start"} margin={"auto"}>
                                 <span
                                     className={"active"}
                                     onClick={() => setCurrentPage(1)}
                                 ></span>
                                <span
                                    className={""}
                                    onClick={() => setCurrentPage(2)}
                                ></span>
                                <span
                                    className={""}
                                    onClick={() => setCurrentPage(3)}
                                ></span>

                                <Button onClick={nextPage} > Next </Button>
                            </Flex>

                            <Button colorScheme="blue" onClick={onClose}>Close</Button>
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
                          <Image src={images.addingLocationFromMapView} height={"25em"} width={"auto"} marginTop={'1em'} border={'black solid 0.1em'} ></Image>

                          <Text marginTop={"1em"} >
                              <b>Filter your locations to find what you want faster!</b>
                          </Text>
                          <Text>
                              While creating a location you can assign categories to it. These are very useful to keep your collection well organized.
                              But that's not all. You can also use LoMap's filter system.
                          </Text>
                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                              <Button onClick={nextPage}> Next </Button>
                          </Flex>

                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
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
                          <Text>In the List of Locations you can find all your saved locations.</Text>
                          <Text>You can click one location to open its details. </Text>

                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              {/*these span dont work yet*/}
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                          </Flex>
                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
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
                            This is where you can save a location. You can write the coordinates directly or
                            use the Adding Location mode and just click on the place you want to add.
                            You can choose the name of the location, add images, give a more detailed description and 
                            give it one or more categories.
                            Categories are useful if you want to keep your locations organized. You can also filter
                            the locations by categories in the 
                            <Link color={"blue.500"} onClick={()=>moveToPage(2)}>Map View</Link>.

                          </Text>

                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              {/*these span dont work yet*/}
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                          </Flex>
                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
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


                          <Text>The tutorial test will be here.</Text>
                          <Text>The tutorial test will be here.</Text>

                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              {/*these span dont work yet*/}
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                          </Flex>
                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
                      </ModalFooter>
                  </>
              )}
              {(currentPage === 6) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - Game </Text>
                      </ModalHeader>
                      <ModalCloseButton/>
                      <Divider></Divider>
                      <ModalBody>


                          <Text>The tutorial test will be here.</Text>
                          <Text>The tutorial test will be here.</Text>

                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              {/*these span dont work yet*/}
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                          </Flex>
                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
                      </ModalFooter>
                  </>
              )}
              {(currentPage === 7) && (
                  <>
                      <ModalHeader fontSize='3xl' fontWeight='bold'>
                          <Image src={images.logo} height={"1em"} width={"auto"}></Image>
                          <Text>Tutorial - Profile </Text>
                      </ModalHeader>
                      <ModalCloseButton/>
                      <Divider></Divider>
                      <ModalBody>


                          <Text>The tutorial test will be here.</Text>
                          <Text>The tutorial test will be here.</Text>

                          <Image src={images.introDialogImg} marginTop={'1em'} border={'black solid'}></Image>
                      </ModalBody>

                      <ModalFooter>
                          <Flex justifyContent={"start"} margin={"auto"}>
                              {/*these span dont work yet*/}
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(1)}
                              ></span>
                              <span
                                  className={""}
                                  onClick={() => setCurrentPage(2)}
                              ></span>
                              <span
                                  className={"active"}
                                  onClick={() => setCurrentPage(3)}
                              ></span>

                              <Button onClick={prevPage}> Previous </Button>
                          </Flex>
                          <Button colorScheme="blue" onClick={onClose}>Close</Button>
                      </ModalFooter>
                  </>
              )}

              </ModalContent>
          </ModalOverlay>
        </Modal>
      </>
    )
  }