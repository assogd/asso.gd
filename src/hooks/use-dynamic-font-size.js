import { useState, useEffect, useRef } from 'react'

const useDynamicFontSize = (text, maxWidth, maxFontSize = 100) => {
  const [fontSize, setFontSize] = useState(maxFontSize)
  const spanRef = useRef(null)

  useEffect(() => {
    const calculateFontSize = () => {
      if (!spanRef.current) return

      const parentWidth = maxWidth || spanRef.current.parentElement.offsetWidth
      let newFontSize = maxFontSize

      spanRef.current.style.fontSize = `${newFontSize}px`
      while (spanRef.current.scrollWidth > parentWidth && newFontSize > 0) {
        newFontSize -= 1
        spanRef.current.style.fontSize = `${newFontSize}px`
      }
      setFontSize(newFontSize)
    }

    calculateFontSize()
    window.addEventListener('resize', calculateFontSize)

    return () => {
      window.removeEventListener('resize', calculateFontSize)
    }
  }, [text, maxWidth, maxFontSize])

  return [fontSize, spanRef]
}

export default useDynamicFontSize
