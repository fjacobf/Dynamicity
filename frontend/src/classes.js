/* eslint-disable @stylistic/semi */
export class Test {
  hello() {
    console.log('hello')
  }
}

export class Point {
  constructor(lat, lon, leafletId) {
    this.lat = lat;
    this.lon = lon;
    this.leafletId = leafletId;
  }

  logCoordinates() {
    console.log(`Latitude: ${this.lat}, Longitude: ${this.lon}`);
  }

  setLatitude(lat) {
    this.lat = lat;
  }

  setLongitude(lon) {
    this.lon = lon;
  }

  getLatitude() {
    return this.lat;
  }

  getLongitude() {
    return this.lon;
  }

  getId() {
    return this.leafletId;
  }

  distanceTo(otherPoint) {
    const R = 6371;
    const lat1 = this.toRadians(this.lat);
    const lat2 = this.toRadians(otherPoint.lat);
    const deltaLat = this.toRadians(otherPoint.lat - this.lat);
    const deltaLon = this.toRadians(otherPoint.lon - this.lon);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  toString() {
    return `Latitude: ${this.lat}, Longitude: ${this.lon}`;
  }
}
