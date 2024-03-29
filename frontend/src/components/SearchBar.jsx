import OutlinedInput from '@mui/material/OutlinedInput'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import locpin from '../assets/loc_pin.png'
import { useState } from 'react'

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?'

function SearchBar(props) {
  // eslint-disable-next-line react/prop-types
  const { setSelectPosition } = props
  const [searchText, setSearchText] = useState('')
  const [listPlace, setListPlace] = useState([])
  return (
    <div className="absolute z-10 right-0 bg-white w-80">
      <OutlinedInput
        size="small"
        value={searchText}
        onChange={event => setSearchText(event.target.value)}
      />
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          const params = { q: searchText, format: 'json', addressdetails: 1, polygon_geojason: 1 }
          const queryString = new URLSearchParams(params).toString()
          const requestOptions = {
            method: 'GET',
            redirect: 'follow',
          }
          fetch(`${NOMINATIM_BASE_URL}${queryString}`, requestOptions)
            .then(response => response.text())
            .then((result) => {
              setListPlace(JSON.parse(result))
            })
            .catch(err => console.log('err: ', err))
        }}
      >
        Search
      </Button>
      <List>
        {listPlace.map(item => (
          <div key={item?.osm_id}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setSelectPosition(item)
                }}
              >
                <ListItemIcon>
                  <img className="w-8" src={locpin} alt="location_pin" />
                </ListItemIcon>
                <ListItemText primary={item?.display_name} />
              </ListItemButton>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  )
}

export default SearchBar
