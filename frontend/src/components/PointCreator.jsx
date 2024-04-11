import { useState } from 'react'
import PropTypes from 'prop-types'

function PointCreator({ onAddPoint }) {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')

  const handleSubmit = (e) => { // Removed unnecessary parentheses
    e.preventDefault()
    if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
      alert('Please enter valid latitude and longitude values.')
      return
    }
    onAddPoint({ lat: parseFloat(lat), lon: parseFloat(lon) })
    setLat('')
    setLon('')
  }

  return (
    <form onSubmit={handleSubmit} className="point-creator-form">
      <input
        type="text"
        placeholder="Latitude"
        value={lat}
        onChange={e => setLat(e.target.value)} // Removed unnecessary parentheses
      />
      <input
        type="text"
        placeholder="Longitude"
        value={lon}
        onChange={e => setLon(e.target.value)} // Removed unnecessary parentheses
      />
      <button type="submit">Add Point</button>
    </form>
  )
}

PointCreator.propTypes = {
  onAddPoint: PropTypes.func.isRequired,
}

export default PointCreator
