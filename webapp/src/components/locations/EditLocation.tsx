import React, {useEffect, useState} from 'react'
import './AddLocationForm.css'
import { Location } from '../../types/types'; 
import {
    Button,
    Tooltip,
    Flex, HStack,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Text,
    Textarea,
    Box, Spinner, CloseButton
} from "@chakra-ui/react";
import { Category } from '../Category';
import { useToast } from "@chakra-ui/react";
import {editLocationSolid} from "../../solid/solidManagement";
import {useSession} from "@inrupt/solid-ui-react";
import {MdOutlineAddLocationAlt, MdArrowDropDown} from "react-icons/md";
import {RxCross2,RxCheck} from "react-icons/rx";
import {MdEdit} from "react-icons/md";
import {BsQuestionCircle} from "react-icons/bs";

type EditLocationProps = {
    locations: Location[];
    setSelectedView: (viewName: string) => void //function to change the selected view on the left
    loadLocations: () => Promise<void>
    loadUserLocations: ()=> Promise<void>
    clickedCoordinates: string;
    setClickedCoordinates: (coords: string) => void;
    setInLocationCreationMode: (activated : boolean) => void;
    setSelectedLocation: (location: Location) => void;
    location: Location;
    setOwnLocations: (newLocations: Location[]) => void;
}





function EditLocationFormComp(props : EditLocationProps) : JSX.Element {
    const [session, setSession] = useState(useSession());
    const [name, setName] = useState(props.location.name);
    const [areValidCoords, setAreValidCoords] = useState(true);
    const [coordsValue, setCoordsValue] = useState(props.location.coordinates.lat + ', ' + props.location.coordinates.lng);
    const [description, setDescription] = useState(props.location.description);
    const [addingLocationProcess, setAddingLocationProcess] = useState(false);
    const [editingManualCoordinates,setEditingManualCoordinates] = useState(false);
    const [checkedCategories, setCheckedCategories] = useState<string[]>(props.location.category);


    useEffect(() => {
        checkCoordinates(coordsValue);
        if(areValidCoords)
        {
            //we update the marker position on the map changing the selected coordinates in App.tsx
            props.setClickedCoordinates(coordsValue);
        }
    }
    , [coordsValue]);

    //we update the state of the coordsvalue when props.clickedCoordinates changes


    const categories = Object.values(Category); // array of strings containing the values of the categories

    //let imgs: string[] = [];
    const [imgs, setImgs] = React.useState<string[]>([]);
    const [imgsFiles, setImgsFiles] = React.useState<File[]>([]);
 
    let lat: number, lon: number;
    let isValidName: boolean = !name || name.trim().length === 0;


    function editLocation(location:Location):void{
        if(session.session.info.webId){
            //we fake the addition of the location by means of adding it to the list of locations
            //and indicating the user the location is being added to the pod in the background
            
            let loc = props.locations.filter(location => location.url !== props.location.url);
            loc.push(location);
            props.setOwnLocations(loc);
            
            //we set the creation mode to false
            setAddingLocationProcess(false);
            //we reset the clicked coordinates to the default value
            props.setClickedCoordinates('');
            //we close the add location form
            props.setSelectedView('Map');

            //we reset the state of the form
            setName('');
            setDescription('');
            setImgs([]);
            setEditingManualCoordinates(false);
             
            //we perform a call to the function that adds the location to the pod
            editLocationSolid(location).then(
                ()=> {
                    props.loadUserLocations();//WORKING
                    toast({
                        title: 'Location correctly edited in your pod',
                        description: "Location '"+location.name+"' was edited in your pod.",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                },
                ()=> {
                    toast({
                        title: 'Error.',
                        description: "Location '"+location.name+"' couldn't be added to your pod.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                }
            );
        }
        
    }

    const regexCoords = /^-?(90|[0-8]?\d)(\.\d+)?, *-?(180|1[0-7]\d|\d?\d)(\.\d+)?$/;
    function checkCoordinates(coords: string): void {
        setAreValidCoords(regexCoords.test(coords));
    }

    function handleCoordsValue(coords: string):void {
        let separatedCoords = coords.split(',');
        lat = Number(separatedCoords[0]);
        lon = Number(separatedCoords[1]);
    }

    const toast = useToast();

    const handleSubmit = (e:any) => {
        e.preventDefault();

        setAddingLocationProcess(true);
        checkCoordinates(coordsValue);


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
            category: checkedCategories,
            description: description.trimStart().trimEnd(),
            imagesAsFile : imgsFiles,
            url: props.location.url
        }

        editLocation(l);

    };
    /**
     * Add/Delete category to/from the location
     * @param e
     */
    const handleCheckedCategory = (e) => {
        const category = e.target.innerText;
        if (checkedCategories.includes(category)) {
            setCheckedCategories(checkedCategories.filter(c => c !== category));
        } else {
            setCheckedCategories([...checkedCategories, category]);
        }
                
    }

  

    return (
        <form onSubmit={handleSubmit}>
            <Flex 
                direction={'column'}
                backgroundColor={'white'}
                width={'30%'}
                height='100%'
                position='absolute'
                left='3%'
                top='0'
                z-index='1'
                gap='4%'
                px={'1%'} overflowY={'auto'}>
                <Flex direction='column'>
                    <Text marginTop='4%' width='fit-content' 
                    fontSize='2.2em' alignSelf='center' borderBottomWidth='1px'>Edit a location</Text>
                    <Flex direction={'column'}>
                        <CloseButton 
                            data-testid='close-button'
                            onClick={() => {
                                props.setSelectedView('Map');
                                props.setClickedCoordinates('');
                                setAddingLocationProcess(false); }}
                            position='absolute'
                            top='2%'
                            right='3%'
                        ></CloseButton>
                    </Flex>
                </Flex>
                <Flex direction={'row'} marginLeft={'5%'} marginRight={'3%'} gap='10%'>
                    <Input
                        data-testid='name-input'
                        value={name}
                        onChange={(e:any) => setName(e.target.value)}                                        
                        placeholder="Location name"
                        size='lg'
                        width='50%'
                        height='160%'
                    />
                    <Menu closeOnSelect={false}>
                            <MenuButton data-testid="categories-button" as={Button} rightIcon={<MdArrowDropDown/>} color='white' background='#4299e1' 
                                width={'27%'} height={'160%'}>Categories
                            </MenuButton>
                            <MenuList minWidth='240px'>
                                <MenuOptionGroup type='checkbox' value={checkedCategories}>
                                    {
                                    categories.map((kind,i) => { // as many possible categories as items in Category enum
                                        return (
                                            <MenuItemOption key={i} value={kind}
                                             onClick={(e) => handleCheckedCategory(e)}
                                             data-testid={kind}
                                                
                                            >{kind}</MenuItemOption>
                                        )
                                    })
                                    }
                                </MenuOptionGroup>
                            </MenuList>
                        </Menu>
                </Flex>
                <Flex direction={'column'} marginLeft={'5%'} marginRight={'3%'} gap='0.8em'
                >
                    <HStack>
                        <Text fontSize='1.5em' >Coordinates</Text>
                        <Button leftIcon={<MdEdit/>} color='white' background='#4299e1'  marginLeft={'auto'}
                            onClick={()=>{ setEditingManualCoordinates(!editingManualCoordinates) }}>
                            Edit manually
                        </Button>
                    </HStack>
                    {/*Circle element with a x in the middle of it */}
                    <HStack>
                        {
                        areValidCoords ?
                        <>
                            <Box width = '3em' height = '3em' borderRadius = '50%' display='flex' alignItems = 'center' justifyContent = 'center' backgroundColor = 'green.500'>
                                <RxCheck size='2.5em' color='white'></RxCheck>
                            </Box>
                            <Text alignSelf='center' fontSize='1.1em'>Valid coordinates selected</Text>
                            <Box width = '1.5em' height = '1.5em' borderRadius = '50%' display='flex' alignItems = 'center' justifyContent = 'center' backgroundColor = 'blue.500'>
                                <Tooltip borderRadius='1em' label="Edit coordinates manually or click on the map to select them."> 
                                    <span>
                                        <BsQuestionCircle size='2em' color='white'></BsQuestionCircle>
                                    </span>
                                </Tooltip> 
                            </Box>
                        </>
                        :
                        <>
                            <Box width = '3em' height = '3em' borderRadius = '50%' display='flex' alignItems = 'center' justifyContent = 'center' backgroundColor = 'red.500'>
                                <RxCross2 size='2.5em' color='white'></RxCross2>
                            </Box>
                            <Text alignSelf='center' fontSize='1.1em' data-testid="coord-error">Select valid coordinates</Text>
                            <Box width = '1.5em' height = '1.5em' borderRadius = '50%' display='flex' alignItems = 'center' justifyContent = 'center' backgroundColor = 'blue.500'>
                                <Tooltip borderRadius='1em' label="Edit coordinates manually or click on the button on the bottom right corner and click on the map to select them."> 
                                    <span>
                                        <BsQuestionCircle size='2em' color='white'></BsQuestionCircle>
                                    </span>
                                </Tooltip> 
                            </Box>
                        </>}
                    </HStack>
                    <Input
                        data-testid='coordinates-input'
                        hidden={!editingManualCoordinates}
                        value={coordsValue}
                        onChange={(e:any) => setCoordsValue(e.target.value)}
                        placeholder='Location coordinates, Ej: 43.3534, -5.8512'
                        size='lg'
                    />
                </Flex>

                <Flex direction={'column'} marginLeft={'5%'} marginRight={'3%'}>
                    <Textarea
                        data-testid='description-input'
                        value={description}
                        onChange={(e:any) => setDescription(e.target.value)}
                        placeholder='Location description'
                        size='lg'
                    />
                </Flex>
                
                
                <Box alignSelf={'center'} marginTop={'auto'} marginBottom={'10%'}>
                    {addingLocationProcess ? (
                        <Button leftIcon={<Spinner size={"xs"}/>}
                                colorScheme={'blue'}
                                variant={'outline'}
                                type={'submit'}
                                disabled
                                height={'170%'}
                                fontSize={'2xl'}>
                            Editing location
                        </Button>
                    ) : (
                        <Button 
                        data-testid='edit-location-button'
                        leftIcon={<MdOutlineAddLocationAlt/>}
                                colorScheme={'blue'}
                                variant={'outline'}
                                type={'submit'}
                                height={'170%'}
                                fontSize={'2xl'}
                                disabled={!areValidCoords || name.trim().length == 0}
                                >
                            Edit location
                        </Button>
                    )}
                </Box>
            </Flex>
        </form>
    );
}


export default EditLocationFormComp;