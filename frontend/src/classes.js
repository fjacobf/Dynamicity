export class Test {
  hello() {
    console.log('hello')
  }
}

export class Point {
  constructor(lat, lon, leafletId) {
    this.lat = lat
    this.lon = lon
    this.leafletId = leafletId
  }

  logCoordinates() {
    console.log(`Latitude: ${this.lat}, Longitude: ${this.lon}`)
  }

  setLatitude(lat) {
    this.lat = lat
  }

  setLongitude(lon) {
    this.lon = lon
  }

  getLatitude() {
    return this.lat
  }

  getLongitude() {
    return this.lon
  }

  getId() {
    return this.leafletId
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

  toString() {
    return `Latitude: ${this.lat}, Longitude: ${this.lon}`
  }
}

export class Line {
  constructor(points, description, id) {
    this.points = points// Array of coordinate pairs {lat, lng}
    this.description = description // starts as null and we will be able to edit it
    this.id = id
  }

  // Method to set or update the description of the line
  setDescription(description) {
    this.description = description
  }

  // Method to update the coordinates of the line
  updatePoints(newPoints) {
    this.points = newPoints
  }

  getPoints() {
    return this.points
  }

  getId() {
    return this.id
  }
}

export class LinesManager {
  constructor() {
    this.lines = []
  }

  // Method to add a new line
  addLine(points) {
    const line = new Line(points, 'Creating new line')
    // add the possibility to add a description alongside the edge info and points
    this.lines.push(line)
    return line
  }

  // Method to get all lines
  getAllLines() {
    console.log('All lines stored:', this.lines)
  }

  // Method to remove a line
  removeLine(line) {
    const index = this.lines.indexOf(line)
    if (index > -1) {
      this.lines.splice(index, 1)
    }
  }

  findLine(id) {
    const line = this.lines.find(line => line.getId() === id)
    return line
  }
}

export class Polygon {
  constructor(points, description, id) {
    this.points = points// Array of coordinate pairs {lat, lng}
    this.description = description // starts as null and we will be able to edit it
    this.id = id
  }

  // Method to set or update the description of the line
  setDescription(description) {
    this.description = description
  }

  // Method to update the coordinates of the line
  updatePoints(newPoints) {
    this.points = newPoints
  }

  getPoints() {
    return this.points
  }

  getId() {
    return this.id
  }
}
