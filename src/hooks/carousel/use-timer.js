import { useState, useRef } from 'react'

export const useTimer = (callback, duration, dependencies = []) => {
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  const startTimer = () => {
    if (!isPaused) {
      const initialProgressTime = progress * (duration / 100)
      startTimeRef.current = Date.now() - initialProgressTime

      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current
        const progressValue = (elapsedTime / duration) * 100

        setProgress(progressValue)

        if (elapsedTime >= duration) {
          clearInterval(intervalRef.current)
          callback()
          setProgress(0)
        }
      }, 100)
    }
  }

  const pauseTimer = () => {
    setIsPaused(true)
    clearInterval(intervalRef.current)
  }

  const resumeTimer = () => {
    setIsPaused(false)
    startTimer()
  }

  const resetTimer = () => {
    clearInterval(intervalRef.current)
    setProgress(0)
    startTimer()
  }

  return { progress, startTimer, pauseTimer, resumeTimer, resetTimer, isPaused }
}
