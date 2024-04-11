import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import PointCreator from './components/PointCreator' // Ensure this path matches where you save PointCreator

function App() {
  const [selectPosition, setSelectPosition] = useState(null)

  return (
    <>
      <PointCreator onAddPoint={setSelectPosition} />
      <Map selectPosition={selectPosition} setSelectPosition={setSelectPosition} />
    </>
  )
}

export default App
