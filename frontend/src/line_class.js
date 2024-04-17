export class Line {
  constructor(coordinates, description) {
    this.coordinates = coordinates// Array of coordinate pairs {lat, lng}
    this.description = description // starts as null and we will be able to edit it
  }

  // Method to set or update the description of the line
  setDescription(description) {
    this.description = description
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
