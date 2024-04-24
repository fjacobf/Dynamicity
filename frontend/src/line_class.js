export class Line {
  constructor(coordinates, description, leafletId) {
    this.coordinates = coordinates// Array of coordinate pairs {lat, lng}
    this.description = description // starts as null and we will be able to edit it
    this.leafletId = leafletId
  }

  // Method to set or update the description of the line
  setDescription(description) {
    this.description = description
  }

  // Method to update the coordinates of the line
  updateCoordinates(newCoordinates) {
    this.coordinates = newCoordinates
  }
}

export class LinesManager {
  constructor() {
    this.lines = []
  }

  // Method to add a new line
  addLine(coordinates) {
    const line = new Line(coordinates, 'criando nova linha')
    // add the possibility to add a description alongside the edge info and coordinates
    this.lines.push(line)
    return line
  }

  // Method to update a line's coordinates
  updateLine(line, newCoordinates) {
    const index = this.lines.indexOf(line)
    if (index !== -1) {
      this.lines[index].updateCoordinates(newCoordinates)
    }
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
}
