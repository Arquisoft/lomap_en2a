import { useSession } from "@inrupt/solid-ui-react";
import { Stack } from "@mui/material";
import { getLocations } from "../../../solid/solidManagement";
import {useState, useEffect} from 'react'
import { Location } from "../../../types/types";

function GetLocations() : JSX.Element {

    const session = useSession();

    const [addresses, setAddresses] = useState<Array<Location>>([]);

    // mirar como iterar sobre Promise<Location[]>
    return (<br></br>)

}

export default GetLocations;