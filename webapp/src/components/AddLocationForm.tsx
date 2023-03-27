import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Box, Button, Flex, HStack, Input, Spacer, Text, Textarea, VStack, Wrap, WrapItem} from "@chakra-ui/react";
import {  SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import  PlaceDetail  from './PlaceDetail';
import Map from './Map';

type AddLocationProps = {
    onSubmit: (location: Location) => void
}


function AddLocationForm(props : any) : JSX.Element {
    const [name, setName] = React.useState('');

    const [coordsValue, setCoordsValue] = React.useState('');
    const [latValue, setLatValue] = React.useState('');
    const [lonValue, setLonValue] = React.useState('');

    const [description, setDescription] = React.useState('');

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
                                images : []}
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

            <input type="file" accept='image/*' multiple></input>

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