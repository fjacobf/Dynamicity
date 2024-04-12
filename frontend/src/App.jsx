import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import SearchBar from './components/SearchBar'

function App() {
  const [selectPosition, setSelectPosition] = useState(null)

  return (
    <>
      <SearchBar setSelectPosition={setSelectPosition} />
      <Map selectPosition={selectPosition} />
    </>
  )
}

export default App
