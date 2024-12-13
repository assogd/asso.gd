import { useRef } from 'react'

export const useGestureDetection = (
  shortHoldThreshold,
  holdThreshold,
  swipeThreshold
) => {
  const pressStartRef = useRef(null)
  const isHoldingRef = useRef(false)
  const isSwipingRef = useRef(false)

  const handleMouseDown = () => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false
    isSwipingRef.current = false
  }

  const handleMouseUp = (e, handlePrev, handleNext) => {
    const pressDuration = Date.now() - pressStartRef.current
    const screenWidth = window.innerWidth
    const clickX = e.clientX

    if (pressDuration >= shortHoldThreshold && pressDuration < holdThreshold) {
      isHoldingRef.current = true
    } else {
      if (!isHoldingRef.current && !isSwipingRef.current) {
        clickX < screenWidth / 2 ? handlePrev() : handleNext()
      }
    }

    isHoldingRef.current = false
  }

  const handleTouchStart = (e) => {
    pressStartRef.current = Date.now()
    isHoldingRef.current = false
    isSwipingRef.current = false
  }

  const handleTouchMove = (e) => {
    const startTouchX = parseFloat(e.target.dataset.startTouchX || 0)
    const currentTouchX = e.touches[0].clientX

    if (Math.abs(currentTouchX - startTouchX) > swipeThreshold) {
      isSwipingRef.current = true
    }
  }

  const handleTouchEnd = (e, handlePrev, handleNext) => {
    const touchX = e.changedTouches[0].clientX
    const screenWidth = window.innerWidth

    if (!isHoldingRef.current && !isSwipingRef.current) {
      touchX < screenWidth / 2 ? handlePrev() : handleNext()
    }

    isHoldingRef.current = false
  }

  return {
    handleMouseDown,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  }
}
