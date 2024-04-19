import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import { Test, Point } from '../classes.js'

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
  let m1 = new Test()
  m1.hello()

  let p1 = new Point(51.505, -0.09);
  p1.logCoordinates(); // Logs: "Latitude: 51.505, Longitude: -0.09"

  // Update the point's coordinates
  p1.setLatitude(52.505);
  p1.setLongitude(-1.09);

  // Log the updated coordinates
  p1.logCoordinates(); // Logs: "Latitude: 52.505, Longitude: -1.09"

  // Retrieve coordinates using getters
  const lat = p1.getLatitude();
  const lon = p1.getLongitude();
  console.log(`Retrieved Latitude: ${lat}, Longitude: ${lon}`);
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      // Extract coordinates of the created marker
      const latlng = layer.getLatLng()
      console.log(`Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`)
    }

    if (layerType === 'polyline') {
      const latlngs = layer.getLatLngs()
      latlngs.forEach((latlng) => {
        console.log(`Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`)
      })
    }

    if (layerType === 'polygon') {
      // Extract coordinates of the created polygon
      const latlngs = layer.getLatLngs()[0] // Get the first ring of the polygon
      latlngs.forEach((latlng) => {
        console.log(`Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`)
      })
    }
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onCreated}
          draw={{ rectangle: false }}
        />
      </FeatureGroup>

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
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
