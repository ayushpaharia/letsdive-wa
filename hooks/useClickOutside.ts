import { useRef, useEffect } from "react"

const useClickOutside = (callback: (e: MouseEvent) => void) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback(e)
      }
    }

    document.addEventListener("click", handleClick)
    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [callback])

  return ref
}

export default useClickOutside
