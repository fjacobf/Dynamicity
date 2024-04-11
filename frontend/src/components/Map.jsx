import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import PropTypes from 'prop-types' // Import PropTypes

function ResetCenterView({ selectPosition }) {
  const map = useMap()

  useEffect(() => {
    if (selectPosition) {
      map.flyTo(
        [selectPosition.lat, selectPosition.lon], // Using array syntax instead of L.latLng
        map.getZoom(),
        {
          animate: true,
        },
      )
    }
  }, [map, selectPosition])

  return null
}

function LocationMarker({ setSelectPosition }) {
  useMapEvents({
    click(e) {
      setSelectPosition({ lat: e.latlng.lat, lon: e.latlng.lng })
    },
  })

  return null
}

function Map({ selectPosition, setSelectPosition }) {
  const locationSelection = selectPosition ? [selectPosition.lat, selectPosition.lon] : null

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">
      <TileLayer
        attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {selectPosition && (
        <Marker position={locationSelection}>
          <Popup>Here</Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
      <LocationMarker setSelectPosition={setSelectPosition} />
    </MapContainer>
  )
}

// Define PropTypes for your component
ResetCenterView.propTypes = {
  selectPosition: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }),
}

LocationMarker.propTypes = {
  setSelectPosition: PropTypes.func.isRequired,
}

Map.propTypes = {
  selectPosition: PropTypes.shape({
    lat: PropTypes.number,
    lon: PropTypes.number,
  }),
  setSelectPosition: PropTypes.func.isRequired,
}

export default Map
