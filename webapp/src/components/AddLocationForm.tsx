import React, {useState} from 'react'
import './AddLocationForm.css'
import { Location } from '../../../restapi/locations/Location'
import {
    Button,
    Checkbox, Divider,
    Flex, HStack,
    Icon, Image,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
    Textarea,
    Box
} from "@chakra-ui/react";
import { Category } from './Category';
import { FormErrorMessage, useToast, VisuallyHidden} from "@chakra-ui/react";
import {createLocation} from "../solid/solidManagement";
import {useSession} from "@inrupt/solid-ui-react";
import {MdOutlineAddLocationAlt} from "react-icons/md";
import noImage from "../no-pictures-picture.png";

type AddLocationProps = {
    loadLocations: () => Promise<void>
    clickedCoords: any;
}

/**
 * Read the file and obtain its base64 encoding.
 * @param file contains the file
 * @param reader FileReader object to do the reading
 * @returns Promise<string> containing the base64 encoding of the file
 */
async function readFileAsync(file, reader) : Promise<string> {
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.readAsDataURL(file);
    })
}



function AddLocationFormComp(props : AddLocationProps) : JSX.Element {
    const [session, setSession] = useState(useSession());
    const [name, setName] = React.useState('');
    const [coordsValue, setCoordsValue] = React.useState(props.clickedCoords);
    const [description, setDescription] = React.useState('');


    let checkedCategories : string[] = [];

    const categories = Object.values(Category); // array of strings containing the values of the categories

    //let imgs: string[] = [];
    const [imgs, setImgs] = React.useState<string[]>([]);


    let lat: number, lon: number;
    let areValidCoords: boolean = false;
    let isValidName: boolean = !name || name.trim().length === 0;


    function addLocation(location:Location):void{
        if(session.session.info.webId)
            createLocation(session.session.info.webId ,location).then(
                ()=> {
                    props.loadLocations();
                    toast({
                        title: 'Location added.',
                        description: "The location was added to your pod.",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                },
                ()=> {
                    toast({
                        title: 'Error.',
                        description: "The location couldn't be added to your pod.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            )
    }

    const regexCoords = /^-?(90|[0-8]?\d)(\.\d+)?, *-?(180|1[0-7]\d|\d?\d)(\.\d+)?$/;
    function checkCoordinates(coords: string): void {
        areValidCoords = regexCoords.test(coords);
    }

    function handleCoordsValue(coords: string):void {
        let separatedCoords = coords.split(',');
        console.log(separatedCoords[0]);
        lat = Number(separatedCoords[0]);
        lon = Number(separatedCoords[1]);
    }

    const toast = useToast();

    const handleSubmit = (e:any) => {
        e.preventDefault();
        checkCoordinates(coordsValue)

        if (isValidName) {
            return;
        }

        if (!areValidCoords) {
            alert("areValidCoords da false");
            return;
        }

        // if no category was selected, autoselect 'Other'
        if (checkedCategories.length == 0){
            checkedCategories.push(Category.Other)
        }

        handleCoordsValue(coordsValue);
        let l : Location = {
            name: name.trimStart().trimEnd(),
            coordinates: {
                lng: lon,
                lat: lat
            },
            category: categories,
            description: description.trimStart().trimEnd(),
            images : imgs
        }
        addLocation(l);
    };
    /**
     * Add/Delete category to/from the location
     * @param e
     */
    const handleCheckedCategory = (e) => {
        // if the index is > -1, means that the location already had this category and the user wants to erase it
        const index = checkedCategories.indexOf(e.target.innerText); //use innerText to get the name of the category
        if (index > -1) { // only splice array when item is found
            checkedCategories.splice(index, 1); // 2nd parameter means remove one item only
        }
        // if the index was not in the checkedCategories means that the user wants to add the category to the location
        else{
            checkedCategories.push(e.target.innerText) // add category
        }
    }

    return (
        <form onSubmit={handleSubmit}>
        <Flex className="flex menu" px={2} height = {'100%'} overflowY={'auto'}>
            <Flex className="flex section">
                <Text as={'b'} fontSize={'x-large'}>Name:</Text>
                <Input
                    value={name}
                    onChange={(e:any) => setName(e.target.value)}                                        
                    placeholder="Location's name"
                    size='sm'
                />
            </Flex>

            <Flex className="flex section">
                <Text as={'b'} fontSize={'x-large'}>Coordinates:</Text>
                <Input
                    value={coordsValue}
                    onChange={(e:any) => {
                        checkCoordinates(e.target.value);
                        if (!areValidCoords) {
                            e.target.style.borderColor = "red"
                        } else {
                            e.target.style.borderColor = "inherit"
                        }
                        setCoordsValue(e.target.value);
                    }}
                    placeholder='Ej: 43.35484910218162, -5.851277716083629'
                    size='sm'
                />
            </Flex>

            <Flex className="flex section">
                <Text as={'b'} fontSize={'x-large'}>Description:</Text>
                <Textarea
                    value={description}
                    onChange={(e:any) => setDescription(e.target.value)}
                    placeholder='Insert a description of the location'
                    size='sm'
                />
            </Flex>

            <Flex className="flex section">
                <Text as={'b'} fontSize={'x-large'}>Select categories:</Text>
                <Menu closeOnSelect={false}>
                    <MenuButton as={Button} colorScheme='orange' minWidth='120px'>Select Category</MenuButton>
                    <MenuList minWidth='240px'>
                        <MenuOptionGroup type='checkbox'>
                            {
                                categories.map((kind) => { // as many possible categories as items in Category enum
                                    return (
                                        <MenuItemOption value={kind} onClick={(e) => handleCheckedCategory(e)}
                                        >{kind}</MenuItemOption>
                                    )
                                })
                            }
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </Flex>

            <Flex className="flex section">
                <Text paddingBottom={'0.5em'} as={'b'} fontSize={'x-large'}>
                    Add images to your location:
                </Text>
                <label className={"label upload-file"}
                       htmlFor="image-input">
                    <i className="fa fa-cloud-upload"></i> Upload images
                </label>
                <Input className={"upload-file"}
                       id={"image-input"}
                       hidden={true}
                       type="file"
                       accept='image/*'
                       border={'0'}
                       onChange={async function(e) {
                           //imgs = []; // array of images empty
                           let reader = new FileReader(); // create reader
                           let files = e.target.files !== null ? e.target.files : []; // obtain files
                           for (let image of files){
                               let res = await readFileAsync(image, reader); // wait for the result
                               //imgs.push(res); // add file to array
                               setImgs(oldArray => [...oldArray, res]);
                           }
                       }}
                       multiple
                >
                </Input>


                <HStack shouldWrapChildren={true} display='flex' overflowX='auto'  height={'fit-content'}>
                    {
                        imgs.length ? (
                                imgs.map((image,i)=>{
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

                            </>
                    }
                </HStack>
            </Flex>
            <Box >
                <Button leftIcon={<MdOutlineAddLocationAlt/>}
                        colorScheme={'orange'}
                        variant={'outline'}
                        type={'submit'}>
                    Add location
                </Button>
            </Box>
        </Flex>
        </form>
    );
}


export default AddLocationFormComp;