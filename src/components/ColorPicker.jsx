import { useState, useEffect, useRef } from 'react'
import { Unstable_Popup as BasePopup } from '@mui/base/Unstable_Popup'
import { ChromePicker } from 'react-color'

export default function ColorPicker({ chave, value, func }) {
  const [anchor, setAnchor] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(Boolean(anchor))

  const componentRef = useRef(null)

  useEffect(() => {
    // Function to handle click events
    const handleClickOutside = (event) => {
      if (componentRef.current && !componentRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleClick = (event) => {
    setAnchor(anchor ? null : event.currentTarget)
    setOpen(!open)
  }

  // const open = Boolean(anchor)
  const id = open ? 'simple-popper' : undefined

  return (
    <div>
      <button aria-describedby={id} type="button" onClick={handleClick} className="mt-0.5 absolute right-36 aspect-square w-5 border border-black rounded-md" style={{ backgroundColor: value }} />
      <BasePopup id={id} open={open} anchor={anchor} keepMounted={false} ref={componentRef}>
        <button type="button" className="text-xs absolute top-0 -right-3 px-1 pb-1 rounded-md bg-gray-300 text-red-600 shadow-lg" onClick={handleClick}>X</button>
        <ChromePicker color={value} onChangeComplete={color => func(chave, color.hex)} />
      </BasePopup>
    </div>
  )
}
