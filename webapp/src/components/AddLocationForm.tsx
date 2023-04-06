import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Button, Flex, FormErrorMessage, Input, Text, Textarea, useToast, VisuallyHidden} from "@chakra-ui/react";
import './AddLocationForm.css'

type AddLocationProps = {
    addLocation: (location: Location) => Promise<void>
    clickedCoords: any;
    addingSuccess: boolean;
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
    const [name, setName] = React.useState('');
    const [coordsValue, setCoordsValue] = React.useState(props.clickedCoords);
    const [description, setDescription] = React.useState('');


    let imgs: string[] = [];
    let lat: number, lon: number;
    let areValidCoords: boolean = false;
    let isValidName: boolean = !name || name.trim().length === 0;


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

        handleCoordsValue(coordsValue);
        let l : Location = {
            name: name.trimStart().trimEnd(),
            coordinates: {
                lng: lon,
                lat: lat
            },
            description: description.trimStart().trimEnd(),
            images : imgs
        }
        props.addLocation(l).then(
            ()=> {
                if (props.addingSuccess)
                    toast({
                        title: 'Location added.',
                        description: "The location was added to your pod.",
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                else
                    toast({
                        title: 'Error.',
                        description: "The location couldn't be added to your pod.",
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
            }
        );

    };

    return (
        <form onSubmit={handleSubmit}>
        <Flex className="flex menu" px={2}>
            <Flex className="flex section">
                <Text>Name:</Text>
                <Input
                    value={name}
                    onChange={(e:any) => setName(e.target.value)}                                        
                    placeholder="Location's name"
                    size='sm'
                />
            </Flex>

            <Flex className="flex section">
                <Text>Coordinates:</Text>
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
                <Text>Description:</Text>
                <Textarea
                    value={description}
                    onChange={(e:any) => setDescription(e.target.value)}
                    placeholder='Insert a description of the location'
                    size='sm'
                />
            </Flex>

            <Flex className="flex section">
                <Text paddingBottom={'0.5em'}>
                    Add images to your location:
                </Text>
                <Input type="file"
                       accept='image/*'
                       border={'0'}
                       onChange={async function(e) {
                           imgs = []; // array of images empty
                           let reader = new FileReader(); // create reader
                           let files = e.target.files !== null ? e.target.files : []; // obtain files
                           for (let image of files){
                               let res = await readFileAsync(image, reader); // wait for the result
                               imgs.push(res); // add file to array
                           }
                       }}
                       multiple>

                </Input>
            </Flex>
            

            <Button colorScheme={'orange'}
                    variant={'outline'}
                    type={'submit'}
            >
                Add location
            </Button>
        </Flex>
        </form>
    );
}



export default AddLocationFormComp;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               