import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Box, Button, Flex, HStack, Input, Spacer, Text, Textarea, VStack, Wrap, WrapItem} from "@chakra-ui/react";
import {  SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import  PlaceDetail  from './PlaceDetail';

type ListProps = {
    isLoading : boolean;
}

function AddLocationMenu(props : ListProps) : JSX.Element {
    const [latValue, setLatValue] = React.useState('')
    const [lonValue, setLonValue] = React.useState('')

    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    function checkCoordinates(lat: string, lon: string): boolean {
        let validLat = regexLat.test(lat);
        let validLon = regexLon.test(lon);
        return validLat && validLon;
    }


    if(props.isLoading)
        return(
        <Flex
            direction={'column'}
            bg={'whiteAlpha.900'}
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
                <Text>Nombre:</Text>
                <Input
                    placeholder='Nombre'
                    size='sm'
                />
            </Flex>

            <Flex direction={'column'}>
                <Text>Latitud: {latValue}</Text>
                <Input
                    value={latValue}
                    placeholder='Inserte latitud'
                    size='sm'
                />

                <Text>Longitud: {lonValue}</Text>
                <Input
                    value={lonValue}
                    placeholder='Inserte longitud'
                    size='sm'
                />
            </Flex>

            <Flex direction={'column'}>
                <Text>Descripción:</Text>
                <Textarea
                    placeholder='Inserte una descripción del lugar'
                    size='sm'
                />
            </Flex>

            <Button colorScheme={'orange'}
                    variant={'outline'}
                    onClick={}
            >Añadir</Button>
        </Flex>
    );

    return(
        <Flex
            direction={'column'}
            bg={'whiteAlpha.900'}
            width={"30vw"}
            height={"100vh"}
            position={'absolute'}
            left={10}
            top={0}
            zIndex={1}
            overflow='hidden'
            px={2}
        >
        </Flex>);
}
export default AddLocationMenu;