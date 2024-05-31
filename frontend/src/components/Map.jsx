/* eslint-disable @stylistic/semi */
import L from 'leaflet'
import 'leaflet-draw/dist/leaflet.draw.css'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup, Polygon, Polyline } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import { DSManager } from '../data_structure.js'
import geoJson from '../data/map.json'
import ReactDOMServer from 'react-dom/server';
import '../style.css'

var ds = new DSManager();
var pontos = []
var linhas = []
var poligonos = []
var fimpoints = false
var fimpolygons = false
var fimlines = false

const areCoordinatesEqual = (coords1, coords2) => {
  if (coords1.length !== coords2.length) return false;
  for (let i = 0; i < coords1.length; i++) {
    if (coords1[i][0] !== coords2[i][0] || coords1[i][1] !== coords2[i][1]) {
      return false;
    }
  }
  return true;
};

geoJson.features.forEach((feature) => {
  if (feature.geometry.type == 'Point') {
    const [lat, lng] = feature.geometry.coordinates;
    pontos.push([lat, lng]);
  }
  else if (feature.geometry.type == 'LineString') {
    const lineCoords = feature.geometry.coordinates.map(coord => [coord[1], coord[0]]); // Leaflet uses [lat, lng]
    if (lineCoords.length > 0) {
      linhas.push(lineCoords);
    }
  }
  else if (feature.geometry.type == 'Polygon') {
    var polyCoords = feature.geometry.coordinates[0].map(coord => [coord[1], coord[0]]); // Leaflet uses [lat, lng]
    if (polyCoords.length > 1) {
      if (areCoordinatesEqual([polyCoords[0]], [polyCoords[polyCoords.length - 1]])) {
        polyCoords.pop();
      }
      poligonos.push(polyCoords);
    }
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
      if (layer instanceof L.Marker) {
        let isPointExisting = false
        const markerLat = layer.getLatLng().lat
        const markerLng = layer.getLatLng().lng
        isPointExisting = pontos.some(p => Math.abs(p[0] - markerLat) < 0.0001 && Math.abs(p[1] - markerLng) < 0.0001)
        if (layer instanceof L.Marker && isPointExisting && !fimpoints) {
          ds.addPoint(layer._leaflet_id, layer.getLatLng())
        }
      }

      if (layer instanceof L.Polyline) {
        const newLineCoords = layer.getLatLngs().map(latlng => [latlng.lat, latlng.lng])
        const isLineExisting = linhas.some(line => areCoordinatesEqual(line, newLineCoords))
        if (isLineExisting && !fimlines) {
          ds.addLine(layer._leaflet_id, layer.getLatLngs())
        }
      }

      if (layer instanceof L.Polygon) {
        const newPolyCoords = layer.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng])
        const isPolygonExisting = poligonos.some(polygon => areCoordinatesEqual(polygon, newPolyCoords))
        if (isPolygonExisting && !fimpolygons) {
          ds.addPolygon(layer._leaflet_id, layer.getLatLngs()[0])
        }
      }

      if (pontos.length == ds.points.length && !fimpoints) {
        fimpoints = true
      }

      if (linhas.length == ds.lines.length && !fimlines) {
        fimlines = true
      }

      if (poligonos.length == ds.polygons.length && !fimpolygons) {
        fimpolygons = true
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

  const [currentElement, setCurrentElement] = useState(null);
  const [currentProperties, setCurrentProperties] = useState([]);

  const handlePropertiesChange = (key, event) => {
    setCurrentProperties({
      ...currentProperties,
      [key]: event.target.value,
    });
  };

  const handleSaveProperties = () => {
    if (currentElement) {
      updateProperties(currentElement.id, currentElement.type, currentProperties);
      setCurrentElement(null);
      setCurrentProperties({});
    }
  };

  const addNewProperty = () => {
    setCurrentProperties({
      ...currentProperties,
      ['new_property_' + Object.keys(currentProperties).length]: '',
    });
  };

  const updateProperties = (id, type, properties) => {
    if (type === 'point') {
      const point = ds.findPoint(id);
      point.setProperties(properties);
    }
    else if (type === 'line') {
      const line = ds.findLine(id);
      line.setProperties(properties);
    }
    else if (type === 'polygon') {
      const polygon = ds.findPolygon(id);
      polygon.setProperties(properties);
    }
  };

  const renderPopupContent = (id, type, properties) => (
    <div className="w-full">
      {
        Object.entries(properties).map(([key, value], index) => (
          <div key={index} className="flex p-1">
            <input
              type="text"
              value={currentElement?.id === id ? currentProperties[key] : value}
              onChange={event => handlePropertiesChange(key, event)}
              className="text-center w-36"
            />
          </div>
        ))
      }
      <div className="buttons flex justify-around p-1">
        <button className="row border-2 rounded-md p-1" onClick={addNewProperty}>Add Row</button>
        <button className="save border-2 rounded-md p-1" onClick={handleSaveProperties}>Save</button>
      </div>
    </div>
  );

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      const point = ds.addPoint(layer._leaflet_id, layer.getLatLng(), { properties: 'New point' });
      layer.on('click', () => {
        setCurrentElement({ id: layer._leaflet_id, type: 'point' });
        setCurrentProperties(point.getProperties());
      });
      layer.bindPopup(ReactDOMServer.renderToStaticMarkup(renderPopupContent(layer._leaflet_id, 'point', { properties: point.getProperties() })));
    }

    if (layerType === 'polyline') {
      const line = ds.addLine(layer._leaflet_id, layer.getLatLngs(), { properties: 'New line' });
      layer.on('click', () => {
        setCurrentElement({ id: layer._leaflet_id, type: 'line' });
        setCurrentProperties(line.getProperties());
      });
      layer.bindPopup(ReactDOMServer.renderToStaticMarkup(renderPopupContent(layer._leaflet_id, 'line', { properties: line.getProperties() })));
    }

    if (layerType === 'polygon') {
      let polygon = ds.addPolygon(layer._leaflet_id, layer.getLatLngs()[0], { properties: 'new polygon' })
      layer.on('click', () => {
        setCurrentElement({ id: layer._leaflet_id, type: 'polygon' });
        setCurrentProperties(polygon.getProperties());
      })
      layer.bindPopup(ReactDOMServer.renderToStaticMarkup(renderPopupContent(layer._leaflet_id, 'polygon', { properties: polygon.getProperties() })));
    }

    console.log('create: ')
    console.log(ds)
  }

  const onEdited = (e) => {
    const editedLayers = e.layers.getLayers()

    editedLayers.forEach((editedLayer) => {
      if (editedLayer instanceof L.Polygon) {
        ds.editPolygon(editedLayer._leaflet_id, editedLayer.getLatLngs()[0])
      }
      else if (editedLayer instanceof L.Polyline) {
        ds.editLine(editedLayer._leaflet_id, editedLayer.getLatLngs())
      }
      else if (editedLayer instanceof L.Marker) {
        ds.editPoint(editedLayer._leaflet_id, editedLayer.getLatLng())
      }
    })

    console.log('edit: ')
    console.log(ds)
  }

  const onDelete = (e) => {
    const removedLayers = e.layers.getLayers()

    removedLayers.forEach((removedLayer) => {
      if (removedLayer instanceof L.Marker) {
        ds.removePoint(removedLayer._leaflet_id)
      }

      if (removedLayer instanceof L.Polyline) {
        ds.removeLine(removedLayer._leaflet_id)
      }

      if (removedLayer instanceof L.Polygon) {
        ds.removePolygon(removedLayer._leaflet_id)
      }
    })
    console.log('delete: ')
    console.log(ds)
  }

  const addPoints = useMemo(() => (
    <>
      {pontos.map((ponto, i) => (
        <Marker key={i} position={ponto}>
          <Popup>
            {renderPopupContent(ponto, 'point', { properties: 'Geojson point' })}
          </Popup>
        </Marker>
      ))}
    </>
  ), [pontos]);

  const addLines = useMemo(() => (
    <>
      {linhas.map((linha, i) => (
        <Polyline key={i} positions={linha}>
          <Popup>
            {renderPopupContent(i, 'line', { properties: 'Geojson line' })}
          </Popup>
        </Polyline>
      ))}
    </>
  ), [linhas]);

  const addPolygons = useMemo(() => (
    <>
      {poligonos.map((poligono, i) => (
        <Polygon key={i} positions={poligono}>
          <Popup>
            {renderPopupContent(i, 'polygon', { properties: 'Geojson polygon' })}
          </Popup>
        </Polygon>
      ))}
    </>
  ), [poligonos]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true} className="MapContainer min-w-screen min-h-screen z-0">

      <Events />

      <FeatureGroup>

        <EditControl
          position="topleft"
          onCreated={onCreated}
          onEdited={onEdited}
          onDeleted={onDelete}
          draw={{
            rectangle: false,
          }}
        />

        {addPoints}
        {addLines}
        {addPolygons}

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
