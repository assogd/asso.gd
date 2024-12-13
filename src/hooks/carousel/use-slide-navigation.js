import { useState } from 'react'

export const useSlideNavigation = (contentLength) => {
  const [isLocked, setIsLocked] = useState(false)

  const handlePrev = (setActive) => {
    if (!isLocked) {
      setIsLocked(true)
      setActive((prev) => (prev > 0 ? prev - 1 : contentLength - 1))
      setTimeout(() => setIsLocked(false), 300)
    }
  }

  const handleNext = (setActive) => {
    if (!isLocked) {
      setIsLocked(true)
      setActive((prev) => (prev < contentLength - 1 ? prev + 1 : 0))
      setTimeout(() => setIsLocked(false), 300)
    }
  }

  return { handlePrev, handleNext }
}
