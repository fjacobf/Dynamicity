/* eslint-disable @stylistic/semi */
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { DSManager } from '../data_structure.js'
import geoJson from '../data/map.json'

var ds = new DSManager();
var pontos = []
var fim = false

geoJson.features.forEach((feature) => {
  if (feature.geometry.type == 'Point') {
    pontos.push([feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
  }
})

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

function Events() {
  const map = useMap();

  useEffect(() => {
    const handleLayerAdd = (event) => {
      const { layer } = event;
      console.log('Layer add event triggered')
      console.log('Type of layer added:', layer instanceof L.Marker ? 'Marker' : 'Other')
      let isPointExisting = false
      if (layer instanceof L.Marker) {
        const markerLat = layer.getLatLng().lat
        const markerLng = layer.getLatLng().lng
        isPointExisting = pontos.some(p => Math.abs(p[0] - markerLat) < 0.0001 && Math.abs(p[1] - markerLng) < 0.0001)
      }
      if (layer instanceof L.Marker && layer.editing._marker._leaflet_id !== layer._leaflet_id) {
        console.log('Marker added with ID:', layer._leaflet_id)
        console.log('Marker coordinates:', layer.getLatLng())
        console.log('State of DSManager before layer: ', JSON.stringify(ds, null, 2))
        ds.addPoint(layer._leaflet_id, layer.getLatLng())
        console.log('State of DSManager after layer: ', JSON.stringify(ds, null, 2))
      }
      else if (layer instanceof L.Marker && isPointExisting && !fim) {
        console.log('Marker added with ID:', layer._leaflet_id)
        console.log('Marker coordinates:', layer.getLatLng())
        console.log('State of DSManager before layer: ', JSON.stringify(ds, null, 2))
        ds.addPoint(layer._leaflet_id, layer.getLatLng())
        console.log('State of DSManager after layer: ', JSON.stringify(ds, null, 2))
      }

      if (pontos.length == ds.points.length && !fim) {
        fim = true
      }
    };

    map.on('layeradd', handleLayerAdd)
    return () => {
      map.off('layeradd', handleLayerAdd)
    };
  }, [map]);

  return null;
}

function Map(props) {
  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]

  // Access the Leaflet element ID after the component is mounted

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      console.log('Marker creation event fired')
      console.log('State of DSManager before creation: ', ds)
      ds.addPoint(layer._leaflet_id, layer.getLatLng())
      console.log('State of DSManager after creation: ', ds)
    }

    if (layerType === 'polyline') {
      ds.addLine(layer._leaflet_id, layer.getLatLngs())
    }

    if (layerType === 'polygon') {
      ds.addPolygon(layer._leaflet_id, layer.getLatLngs()[0])
    }
    // console.log('create: ')
    console.log(ds)
  }

  const onEdited = (e) => {
    const editedLayers = e.layers.getLayers()

    console.log(e.layers.getLayers())

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

  const addPoints = useMemo(() => (
    <>
      {pontos.map((ponto, i) =>
        <Marker key={i} position={ponto} />,
      )}
    </>
  ), [pontos])

  return (
    <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">

      <Events />

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

        {addPoints}

        {/* {ds.getPoints().map(point =>
          <Marker key={point.id} position={[point.lat, point.lon]} leafletId={point.id} />,
        )} */}

        {
          // pontos.forEach((ponto, index) =>
          //   // eslint-disable-next-line react/jsx-key
          //   <Marker key={index} position={ponto} />,
          // )
        }

        {console.log(ds)}

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
