/* eslint-disable @stylistic/semi */
export class DSManager {
  constructor() {
    this.points = []
    this.lines = []
    this.polygons = []
  }

  addPoint(id, coordinates, properties) {
    if (this.points.some(point => point.getId() === id)) {
      console.log(`Point with ID ${id} already exists. Skipping add.`);
      return; // Early return to prevent addition
    }
    let point = new Point(coordinates.lat, coordinates.lng, id, properties);
    this.points.push(point);
  }

  editPoint(id, new_lat_lng) {
    const editedPointIndex = this.points.findIndex(point => point.getId() === id)

    if (editedPointIndex !== -1) {
      this.points[editedPointIndex].setLatitude(new_lat_lng.lat)
      this.points[editedPointIndex].setLongitude(new_lat_lng.lng)
    }

    return this.points[editedPointIndex]
  }

  removePoint(id) {
    const removedPointIndex = this.points.findIndex(point => point.getId() === id)

    if (removedPointIndex !== -1) {
      this.points.splice(removedPointIndex, 1)
      return true
    }

    return false
  }

  findPoint(id) {
    const point = this.points.find(point => point.getId() === id)
    return point
  }

  getPoints() {
    return this.points
  }

  // Method to add a new line
  addLine(id, points, properties) {
    const pointObjects = points.map(latlng => new Point(latlng.lat, latlng.lng))
    const line = new Line(pointObjects, id, properties)
    this.lines.push(line)
    return line
  }

  editLine(id, LatLngs) {
    const newPoints = LatLngs.map(latlng => new Point(latlng.lat, latlng.lng))
    const lineToEdit = this.lines.find(line => line.getId() === id)

    if (lineToEdit) {
      lineToEdit.setPoints(newPoints)
      return lineToEdit
    }
    else {
      console.log('No line found with the ID:', id)
      return null
    }
  }

  removeLine(id) {
    const lineToRemoveIndex = this.lines.findIndex(line => line.getId() === id)

    if (lineToRemoveIndex !== -1) {
      this.lines.splice(lineToRemoveIndex, 1)
      return true
    }
    return false
  }

  findLine(id) {
    const line = this.lines.find(line => line.getId() === id)
    return line
  }

  // Method to get all lines
  getLines() {
    return this.lines
  }

  addPolygon(id, points, properties) {
    const pointObjects = points.map(latlng => new Point(latlng.lat, latlng.lng))
    let polygon = new Polygon(pointObjects, id, properties)
    this.polygons.push(polygon)
  }

  editPolygon(id, points) {
    const newPoints = points.map(latlng => new Point(latlng.lat, latlng.lng))
    const polygonToEdit = this.polygons.find(polygon => polygon.getId() === id)

    if (polygonToEdit) {
      polygonToEdit.setPoints(newPoints)
      return polygonToEdit
    }
    else {
      console.log('No polygon found with the ID:', id)
      return null
    }
  }

  removePolygon(id) {
    const polygonToRemoveIndex = this.polygons.findIndex(polygon => polygon.getId() === id)

    if (polygonToRemoveIndex !== -1) {
      this.polygons.splice(polygonToRemoveIndex, 1)
      return polygonToRemoveIndex
    }
  }

  findPolygon(id) {
    const polygon = this.polygon.find(polygon => polygon.getId() === id)
    return polygon
  }

  getPolygons() {
    return this.polygons
  }
}

export class Point {
  constructor(lat, lon, id, properties) {
    this.lat = lat
    this.lon = lon
    this.id = id
    this.properties = properties
  }

  setLatitude(lat) {
    this.lat = lat
  }

  setLongitude(lon) {
    this.lon = lon
  }

  setProperties(properties) {
    this.properties = properties
  }

  getLatitude() {
    return this.lat
  }

  getLongitude() {
    return this.lon
  }

  getProperties() {
    return this.properties
  }

  getId() {
    return this.id
  }

  distanceTo(otherPoint) {
    const R = 6371
    const lat1 = this.toRadians(this.lat)
    const lat2 = this.toRadians(otherPoint.lat)
    const deltaLat = this.toRadians(otherPoint.lat - this.lat)
    const deltaLon = this.toRadians(otherPoint.lon - this.lon)

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }
}

export class Line {
  constructor(points, id, properties) {
    this.points = points
    this.id = id
    this.properties = properties
  }

  setPoints(newPoints) {
    this.points = newPoints
  }

  setProperties(properties) {
    this.properties = properties
  }

  getPoints() {
    return this.points
  }

  getProperties() {
    return this.properties
  }

  getId() {
    return this.id
  }
}

export class Polygon {
  constructor(points, id, properties) {
    this.points = points
    this.id = id
    this.properties = properties
  }

  // Method to update the coordinates of the line
  setPoints(newPoints) {
    this.points = newPoints
  }

  setProperties(properties) {
    this.properties = properties
  }

  getPoints() {
    return this.points
  }

  getProperties() {
    return this.properties
  }

  getId() {
    return this.id
  }
}
