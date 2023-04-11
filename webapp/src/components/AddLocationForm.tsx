import React from 'react'
import { Location } from '../../../restapi/locations/Location'
import {Button, Checkbox, Flex, Input, Menu, MenuButton, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Text, Textarea} from "@chakra-ui/react";
import { Category } from './Category';

type AddLocationProps = {
    onSubmit: (location: Location) => void
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

    const [latValue, setLatValue] = React.useState('');    

    const [lonValue, setLonValue] = React.useState('');

    const [description, setDescription] = React.useState('');

    let checkedCategories : string[] = [];

    const categories = Object.values(Category); // array of strings containing the values of the categories

    let imgs: string[] = [];

    const regexLat = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const regexLon = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    function checkCoordinates(lat: string, lon: string): boolean {
        let validLat = regexLat.test(lat);
        let validLon = regexLon.test(lon);
        return validLat && validLon;
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();
        // if no category was selected, autoselect 'Other'
        if (checkedCategories.length == 0){
            checkedCategories.push(Category.Other)
        }
        //if (checkCoordinates(latValue, lonValue)) {
            let l : Location = {name: name,
                                coordinates: {
                                    lng: Number(lonValue),
                                    lat: Number(latValue)
                                },
                                description: description,
                                images : imgs,
                                category: checkedCategories}
            props.onSubmit(l);
            return;
        //}

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
                <Text>Nombre:</Text>
                <Input
                    value={name}
                    onChange={(e:any) => setName(e.target.value)}                                        
                    placeholder='Nombre'
                    size='sm'
                />
            </Flex>

            <Flex direction={'column'}>
                <Text>Latitud:</Text>
                <Input
                    value={latValue}
                    onChange={(e:any) => setLatValue(e.target.value)}
                    placeholder='Inserte latitud'
                    size='sm'
                />

                <Text>Longitud:</Text>
                <Input
                    value={lonValue}
                    onChange={(e:any) => setLonValue(e.target.value)}
                    placeholder='Inserte longitud'
                    size='sm'
                />
            </Flex>

            <Flex direction={'column'}>
                <Text>Descripción:</Text>
                <Textarea
                    value={description}
                    onChange={(e:any) => setDescription(e.target.value)}
                    placeholder='Inserte una descripción del lugar'
                    size='sm'
                />
            </Flex>

            <Menu closeOnSelect={false}>
                <MenuButton as={Button} colorScheme='blue' minWidth='120px'>Select Category</MenuButton>
                <MenuList minWidth='240px'>
                  <MenuOptionGroup type='checkbox'>
                    {
                      categories.map((kind,i) => { // as many possible categories as items in Category enum
                        return (
                          <MenuItemOption key={i} value={kind} onClick={(e) => handleCheckedCategory(e)}
                          >{kind}</MenuItemOption>
                        )
                      })
                    }
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            
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
                    type={'submit'}
            >
                Añadir
            </Button>
        </Flex>
        </form>
    );
}



export default AddLocationForm;