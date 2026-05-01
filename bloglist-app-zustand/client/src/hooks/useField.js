import { useState } from "react"

const useField = ({ type, name, label }) => {
  const [value, setValue] = useState('')

  const onChange = (e) => {
    setValue(e.target.value);
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    label,
    name,
    value,
    onChange,
    reset
  }
}

export default useField