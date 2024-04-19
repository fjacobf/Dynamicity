/* eslint-disable @stylistic/semi */
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
  // List of points

  var points = []
  let m1 = new Test()
  m1.hello()
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      // Extract coordinates of the created marker
      const latlng = layer.getLatLng()
      let point = new Point(latlng.lat, latlng.lng, layer._leaflet_id)
      point.logCoordinates()
      points.push(point)
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

  const onEdited = (e) => {
    console.log('onEdited event triggered');
    const editedLayers = e.layers.getLayers();
    editedLayers.forEach((editedLayer) => {
      const editedLatLng = editedLayer.getLatLng();
      // Find the corresponding point in the points list
      const editedPointIndex = points.findIndex(
        point =>
          point.getId() === editedLayer._leaflet_id,
      );

      if (editedPointIndex !== -1) {
        // Update the corresponding point's coordinates
        points[editedPointIndex].setLatitude(editedLatLng.lat);
        points[editedPointIndex].setLongitude(editedLatLng.lng);
        // Log the updated coordinates
        points[editedPointIndex].logCoordinates();
      }
    });
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onCreated}
          onEdited={onEdited}
          draw={{ rectangle: false }}
        />
        <Marker position={[51.505, -0.09]}></Marker>
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
