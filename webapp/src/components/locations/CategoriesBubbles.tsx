import { Badge, Flex} from "@chakra-ui/react"
import { Location } from "../../types/types"

type CategoriesBubblesProps = {
    location : Location
}

export default function CategoriesBubbles(props : CategoriesBubblesProps):JSX.Element{
    const colors = ['teal', 'purple', 'pink', 'blue', 'green', 'orange'];
    console.log(props.location)
    return(
        <Flex gap='4%' marginLeft='10%' marginTop='2%'>
            {
              props.location.category.map((category, index) => {
                return (
                  <Badge padding='1%' borderRadius='10' 
                  colorScheme={colors[index % colors.length]}>{category}
                  </Badge>
                )
              })
            }
          </Flex>
    )
}