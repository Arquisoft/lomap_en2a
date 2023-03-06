import React from 'react'
import { Location } from '../../../restapi/locations/Location'

type ListProps = {
    places : Array<Location>;
    isLoading : () => void;
}

export const List = (props : ListProps) => {
  return (
    <div>List</div>
  )
}
