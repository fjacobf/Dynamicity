/* eslint-disable @stylistic/semi */
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
import { Point, Line, Polygon } from '../classes.js'
import '../style.css'

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

  const [points, setPoints] = useState([]);
  const [lines] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [currentDescription, setCurrentDescription] = useState('');

  // eslint-disable-next-line react/prop-types
  const { selectPosition } = props
  // eslint-disable-next-line react/prop-types
  const locationSelection = [selectPosition?.lat, selectPosition?.lon]

  /*
  const handlePointChange = (index, attribute, value) => {
    const updatedPoints = [...points];
    if (attribute === 'lat') updatedPoints[index].updateCoordinates(parseFloat(value), updatedPoints[index].lon);
    if (attribute === 'lon') updatedPoints[index].updateCoordinates(updatedPoints[index].lat, parseFloat(value));
    if (attribute === 'id') updatedPoints[index].updateId(value);
    points.push(updatedPoints);
  };

  const handleLineChange = (index, attribute, value) => {
    const updatedLines = [...lines];
    if (attribute === 'description') updatedLines[index].setDescription(value);
    if (attribute === 'points') updatedLines[index].updatePoints(value.split('\n').map((p) => {
      const [lat, lon] = p.split(', ');
      return new Point(parseFloat(lat), parseFloat(lon));
    }));
    if (attribute === 'id') updatedLines[index].updateId(value);
    lines.push(updatedLines);
  };

  const handlePolygonChange = (index, attribute, value) => {
    const updatedPolygons = [...polygons];
    if (attribute === 'description') updatedPolygons[index].setDescription(value);
    if (attribute === 'points') updatedPolygons[index].updatePoints(value.split('\n').map((p) => {
      const [lat, lon] = p.split(', ');
      return new Point(parseFloat(lat), parseFloat(lon));
    }));
    if (attribute === 'id') updatedPolygons[index].updateId(value);
    polygons.push(updatedPolygons);
  };
  */

  const onCreated = (e) => {
    const { layerType, layer } = e

    if (layerType === 'marker') {
      // Extract coordinates of the created marker
      const latlng = layer.getLatLng()
      // let point = new classesJs.Point(latlng.lat, latlng.lng, layer._leaflet_id)
      let point = new Point(latlng.lat, latlng.lng, layer._leaflet_id)
      point.logCoordinates()
      setPoints([...points, point]);
    }

    if (layerType === 'polyline') {
      const pointObjects = layer.getLatLngs().map(latlng => new Point(latlng.lat, latlng.lng))
      let line = new Line(pointObjects, 'new line', layer._leaflet_id)
      lines.push(line)
      console.log('All lines stored:', lines)
    }

    if (layerType === 'polygon') {
      const pointObjects = layer.getLatLngs()[0].map(latlng => new Point(latlng.lat, latlng.lng))
      let polygon = new Polygon(pointObjects, 'new Polygon', layer._leaflet_id)
      setPolygons([...polygons, polygon])
      console.log('All polygons stored:', polygons)
    }
  }
  const handleDescriptionChange = (event) => {
    setCurrentDescription(event.target.value);
  };

  const handleSaveDescription = (index) => {
    const updatedPoints = [...points];
    const newDescription = updatedPoints[index].description
      ? `${updatedPoints[index].description}\n${currentDescription}`
      : currentDescription;
    updatedPoints[index].setDescription(newDescription);
    setPoints(updatedPoints);
    setCurrentDescription('');
  };
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
        const newPoints = editedLayer.getLatLngs().map(latlng => new Point(latlng.lat, latlng.lng))
        const lineToEdit = lines.find(line => line.getId() === editedLayer._leaflet_id)

        if (lineToEdit) {
          lineToEdit.updatePoints(newPoints)
          console.log('Updated line:', lineToEdit)
        }
        else {
          console.log('No line found with the ID:', editedLayer._leaflet_id)
        }
        console.log('All lines stored:', lines)
        // lines.getAllLines() // Log all lines to console after editing
      }

      if (editedLayer instanceof L.Polygon) {
        const newPoints = editedLayer.getLatLngs()[0].map(latlng => new Point(latlng.lat, latlng.lng))
        const polygonToEdit = polygons.find(polygon => polygon.getId() === editedLayer._leaflet_id)

        if (polygonToEdit) {
          polygonToEdit.updatePoints(newPoints)
          console.log('Updated polygon:', polygonToEdit)
        }
        else {
          console.log('No polygon found with the ID:', editedLayer._leaflet_id)
        }
        console.log('All polygons stored:', polygons)
      }
    })
  }

  const handleDelete = (e) => {
    console.log('handleDelete event triggered')
    const removedLayers = e.layers.getLayers()

    removedLayers.forEach((removedLayer) => {
      // Check if the removed layer is a marker
      if (removedLayer instanceof L.Marker) {
        const removedPointIndex = points.findIndex(point => point.getId() === removedLayer._leaflet_id)

        if (removedPointIndex !== -1) {
          points.splice(removedPointIndex, 1)
          console.log(`Point ${removedPointIndex} removed.`)
        }
      }

      // Check if the removed layer is a polyline
      if (removedLayer instanceof L.Polyline) {
        const lineToRemoveIndex = lines.findIndex(line => line.getId() === removedLayer._leaflet_id)

        if (lineToRemoveIndex !== -1) {
          lines.splice(lineToRemoveIndex, 1)
          console.log(`Removed polygon: ${lineToRemoveIndex}`)
        }
        console.log('All lines stored:', lines)
      }

      // Check if the removed layer is a polygon
      if (removedLayer instanceof L.Polygon) {
        const polygonToRemoveIndex = polygons.findIndex(polygon => polygon.getId() === removedLayer._leaflet_id)

        if (polygonToRemoveIndex !== -1) {
          polygons.splice(polygonToRemoveIndex, 1)
          console.log(`Removed polygon: ${polygonToRemoveIndex}`)
        }
        console.log('All polygons stored:', polygons)
      }
    })
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
        <Marker position={[51.505, -0.09]}>
          <Popup>
            Hello
          </Popup>
        </Marker>

        {points.map((point, index) => (
          <Marker key={point.id} position={[point.lat, point.lon]}>
            <Popup>
              <div>
                <label>
                  Description:
                  <input
                    type="text"
                    value={currentDescription}
                    onChange={handleDescriptionChange}
                  />
                </label>
                <br />
                <button onClick={() => handleSaveDescription(index)}>Save</button>
                <br />
                <div>{point.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {lines.map(line => (
          <Line key={line.id} positions={line.points.map(p => [p.lat, p.lon])}>
            <Popup>Hello</Popup>
          </Line>
        ))}
        {polygons.map(polygon => (
          <Polygon key={polygon.id} positions={polygon.points.map(p => [p.lat, p.lon])}>
            <Popup>Hello</Popup>
          </Polygon>
        ))}
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
