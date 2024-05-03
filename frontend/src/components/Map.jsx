/* eslint-disable @stylistic/semi */
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
import { DSManager } from '../data_structure.js'

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
  var ds = new DSManager();
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      ds.addPoint(layer._leaflet_id, layer.getLatLng())
    }

    if (layerType === 'polyline') {
      ds.addLine(layer._leaflet_id, layer.getLatLngs())
    }

    if (layerType === 'polygon') {
      ds.addPolygon(layer._leaflet_id, layer.getLatLngs()[0])
    }
    console.log('create: ')
    console.log(ds)
  }

  const onEdited = (e) => {
    const editedLayers = e.layers.getLayers()

    editedLayers.forEach((editedLayer) => {
      // Por algum motivo um poligono tambem é uma instancia de polyline (???)
      if (editedLayer instanceof L.Polygon) {
        ds.editPolygon(editedLayer._leaflet_id, editedLayer.getLatLngs()[0])
      }
      // Check if the edited layer is a polyline
      else if (editedLayer instanceof L.Polyline) {
        ds.editLine(editedLayer._leaflet_id, editedLayer.getLatLngs())
      }
      // Check if the edited layer is a marker
      else if (editedLayer instanceof L.Marker) {
        ds.editPoint(editedLayer._leaflet_id, editedLayer.getLatLng())
      }
    })

    console.log('edit: ')
    console.log(ds)
  }

  const handleDelete = (e) => {
    const removedLayers = e.layers.getLayers()

    removedLayers.forEach((removedLayer) => {
      // Check if the removed layer is a marker
      if (removedLayer instanceof L.Marker) {
        ds.removePoint(removedLayer._leaflet_id)
      }

      // Check if the removed layer is a polyline
      if (removedLayer instanceof L.Polyline) {
        ds.removeLine(removedLayer._leaflet_id)
      }

      // Check if the removed layer is a polygon
      if (removedLayer instanceof L.Polygon) {
        ds.removePolygon(removedLayer._leaflet_id)
      }
    })
    console.log('delete: ')
    console.log(ds)
  }

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={onCreated}
          onEdited={onEdited}
          onDeleted={handleDelete}
          draw={{
            rectangle: false,
          }}
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
