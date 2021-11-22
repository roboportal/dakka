import { useState, useCallback } from 'react'

export default function useToggle(
  defaultValue: boolean,
): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue)
  const toggleValue = useCallback(() => {
    setValue((v) => !v)
  }, [])

  return [value, toggleValue]
}
