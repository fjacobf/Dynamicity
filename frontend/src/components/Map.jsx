import { useEffect } from 'react'
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet'
import { statesData } from '../assets/us-states'

function ResetCenterView(props) {
  const { selectPosition } = props
  const map = useMap()

  useEffect(() => {
    if (selectPosition) {
      map.flyTo(
        // eslint-disable-next-line no-undef
        L.latLng(selectPosition?.lat, selectPosition?.lon),
        map.getZoom(),
        {
          animate: true,
        },
      )
    }
  }, [map, selectPosition])
}

function Map(props) {
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className="MapContainer min-w-screen min-h-screen z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {
        statesData.features.map((state) => {
          const coordinates = state.geometry.coordinates[0].map(item => [item[1], item[0]])

          return (
            // eslint-disable-next-line react/jsx-key
            <Polygon
              pathOptions={{
                fillColor: '#FD8D3C',
                fillOpacity: 0.7,
                weight: 2,
                opacity: 1,
                dashArray: 3,
                color: 'white',
              }}
              positions={coordinates}
              eventHandlers={{
                mouseover: (e) => {
                  const layer = e.target
                  layer.setStyle({
                    fillOpacity: 1,
                    weight: 5,
                    dashArray: '',
                    color: '#666',
                    fillColor: '#D45962',
                  })
                },
                mouseout: (e) => {
                  const layer = e.target
                  layer.setStyle({
                    fillOpacity: 0.7,
                    weight: 2,
                    dashArray: '3',
                    color: 'white',
                    fillColor: '#FD8D3C',
                  })
                },
                click: () => {
                  console.log(state.properties.name)
                },
              }}
            />
          )
        })
      }
      {selectPosition && (
        <Marker position={locationSelection}>
          <Popup>
            Here
          </Popup>
        </Marker>
      )}
      <ResetCenterView selectPosition={selectPosition} />
    </MapContainer>
  )
}

export default Map
