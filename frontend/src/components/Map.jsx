import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import * as classesJs from '../classes.js'
import L from 'leaflet'

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
  var polygons = []
  let m1 = new classesJs.Test()
  m1.hello()
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]
  let lines = new classesJs.LinesManager()

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      // Extract coordinates of the created marker
      const latlng = layer.getLatLng()
      let point = new classesJs.Point(latlng.lat, latlng.lng, layer._leaflet_id)
      point.logCoordinates()
      points.push(point)
    }

    if (layerType === 'polyline') {
      const pointObjects = layer.getLatLngs().map(latlng => new classesJs.Point(latlng.lat, latlng.lng))
      let line = new classesJs.Line(pointObjects, 'new line', layer._leaflet_id)
      lines.addLine(line)
      lines.getAllLines()
    }

    if (layerType === 'polygon') {
      const pointObjects = layer.getLatLngs()[0].map(latlng => new classesJs.Point(latlng.lat, latlng.lng))
      let polygon = new classesJs.Polygon(pointObjects, 'new Polygon', layer._leaflet_id)
      polygons.push(polygon)
      console.log('All polygons stored:', polygons)
    }
  }

  const onEdited = (e) => {
    console.log('onEdited event triggered')
    const editedLayers = e.layers.getLayers()

    editedLayers.forEach((editedLayer) => {
      // Check if the edited layer is a marker
      if (editedLayer instanceof L.Marker) {
        const editedLatLng = editedLayer.getLatLng()
        const editedPointIndex = points.findIndex(point => point.getId() === editedLayer._leaflet_id)

        if (editedPointIndex !== -1) {
          points[editedPointIndex].setLatitude(editedLatLng.lat)
          points[editedPointIndex].setLongitude(editedLatLng.lng)
          points[editedPointIndex].logCoordinates()
        }
      }

      // Check if the edited layer is a polyline
      if (editedLayer instanceof L.Polyline) {
        const newPoints = editedLayer.getLatLngs().map(latlng => new classesJs.Point(latlng.lat, latlng.lng))
        const lineToEdit = lines.findLine(editedLayer._leaflet_id)

        if (lineToEdit) {
          lineToEdit.updatePoints(newPoints)
          console.log('Updated line:', lineToEdit)
        }
        else {
          console.log('No line found with the ID:', editedLayer._leaflet_id)
        }
        lines.getAllLines() // Log all lines to console after editing
      }

      if (editedLayer instanceof L.Polygon) {
        const newPoints = editedLayer.getLatLngs()[0].map(latlng => new classesJs.Point(latlng.lat, latlng.lng))
        const polygonToEdit = polygons.find(polygon => polygon.getId() === editedLayer._leaflet_id)

        if (polygonToEdit) {
          polygonToEdit.updatePoints(newPoints)
          console.log('Updated polygon:', polygonToEdit)
        }
        else {
          console.log('No polygon found with the ID:', editedLayer._leaflet_id)
        }
      }
      console.log('All polygons stored:', polygons)
    })
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onCreated}
          onEdited={onEdited}
          // onDeleted={handleDelete}
          draw={{
            rectangle: false,
          }}
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
