import { Image, Text, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, HStack} from "@chakra-ui/react"
import { Location } from "../../../restapi/locations/Location"



export function LocationView({isOpen, onClose}) : JSX.Element {  
    
    const place : Location = {
        name: "Estatua de la libertad",
        coordinates: {
          lng: -74.044502,
          lat: 40.689249
        },
        description: "Estatua de la libertad en Estados Unidos",
        images : ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-TaW47nFmTjtUFZUq0rzykiK-uHz0xf48g&usqp=CAU',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIXIVZ8SPzx19XPic897rr8uaTqP5FzYgjyg&usqp=CAU',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlQXdfB4Qmp35_btkh7qJ62zbu67_WqMmTag&usqp=CAU']
      }

    return (
      <>
        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth='1px'>{place.name}</DrawerHeader>
            <DrawerBody>
                <Text>
                    {place.description}
                </Text>    
                           
                <HStack shouldWrapChildren={true}>
                {
                    place.images?.length != null ? 
                    (
                        place.images?.map((image)=>{
                            return (
                            
                                <Image src={image as string}></Image>
                            
                            )
                        })   
                    ) 
                    : 
                    <Text>
                        No photos available
                    </Text>
                }
                </HStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  