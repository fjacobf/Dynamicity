import { useState } from 'react'
import Map from './components/Map'
import InputFileUpload from './components/InputFileUpload'
function App() {
  const [file, setFile] = useState(null)

  return (
    <>
      <InputFileUpload setFile={setFile} />
      <Map file={file} />
    </>
  )
}

export default App
