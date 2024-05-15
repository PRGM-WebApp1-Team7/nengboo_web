import { useState, useEffect } from "react"

const useDebounce = (value, delay) => {
  const [deboucneValue, setDebounceValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return deboucneValue
}

export default useDebounce
