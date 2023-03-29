import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Button, Flex, Input, Text, Textarea} from "@chakra-ui/react";

type AddLocationProps = {
    onSubmit: (location: Location) => void
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


function AddLocationForm(props : AddLocationProps) : JSX.Element {
    const [name, setName] = React.useState('');

    const [coordsValue, setCoordsValue] = React.useState(props.clickedCoords);
    const [latValue, setLatValue] = React.useState('');
    const [lonValue, setLonValue] = React.useState('');

    const [description, setDescription] = React.useState('');

    let imgs: string[] = [];

    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    function checkCoordinates(lat: string, lon: string): boolean {
        let validLat = regexLat.test(lat);
        let validLon = regexLon.test(lon);
        return validLat && validLon;
    }

    function handleCoordsValue(coords: string):void {
        let separatedCoords = coords.split(',');
        console.log(separatedCoords);
        setLatValue(separatedCoords[0]);
        setLonValue(separatedCoords[1]);
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();

        handleCoordsValue(coordsValue);
        //if (checkCoordinates(latValue, lonValue)) {
            let l : Location = {name: name,
                                coordinates: {
                                    lng: Number(lonValue),
                                    lat: Number(latValue)
                                },
                                description: description,
                                images : imgs}
            props.onSubmit(l);
            return;
        //}

    };


    return (
        <form onSubmit={handleSubmit}>
        <Flex
            direction={'column'}
            bg={'white'}
            width={"30vw"}
            height={"100vh"}
            position={'absolute'}
            left={'5vw'}
            top={0}
            zIndex={1}
            overflow='hidden'
            px={2}
            rowGap="2em"            
        >
            <Flex direction={'column'}>
                <Text>Name:</Text>
                <Input
                    value={name}
                    onChange={(e:any) => setName(e.target.value)}                                        
                    placeholder="Location's name"
                    size='sm'
                />
            </Flex>

            <Flex direction={'column'}>
                <Text>Coordinates:</Text>
                <Input
                    value={coordsValue}
                    onChange={(e:any) => setCoordsValue(e.target.value)}
                    placeholder='Ej: 43.35484910218162, -5.851277716083629'
                    size='sm'
                />
                {/*<Text>Longitud:</Text>
                <Input
                    value={lonValue}
                    onChange={(e:any) => setLonValue(e.target.value)}
                    placeholder='Inserte longitud'
                    size='sm'
                />*/}
            </Flex>

            <Flex direction={'column'}>
                <Text>Description:</Text>
                <Textarea
                    value={description}
                    onChange={(e:any) => setDescription(e.target.value)}
                    placeholder='Insert a description of the location'
                    size='sm'
                />
            </Flex>

            
            <Input 
                type="file" 
                accept='image/*' 
                onChange={async function(e) {
                    imgs = []; // array of images empty
                    var reader = new FileReader(); // create reader
                    let files = e.target.files !== null ? e.target.files : []; // obtain files
                    for (let image of files){
                        let res = await readFileAsync(image, reader); // wait for the result
                        imgs.push(res); // add file to array
                    }
                }} 
                multiple>

            </Input>
            

            <Button colorScheme={'orange'}
                    variant={'outline'}
                    //onClick={() => {addLocation()}}
                    type={'submit'}
            >
                Add location
            </Button>
        </Flex>
        </form>
    );
}



export default AddLocationForm;