import { useState } from 'react'
import Map from './components/Map'

function App() {
  const [selectPosition] = useState(null)

  return (
    <>
      <Map selectPosition={selectPosition} />
    </>
  )
}

export default App
