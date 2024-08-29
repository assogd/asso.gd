'use client'
import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export const FadeInOnLoad = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }} // Adjust the duration to control the speed of the fade-in
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const LazyLoadItem = ({ children, className = '' }) => {
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: '500px',
    threshold: 0
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={className}
    >
      {inView && children}
    </motion.div>
  )
}

export const LoopSVGs = ({ frames, intervalRange = [1000, 20000] }) => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const setRandomInterval = () => {
      const [minInterval, maxInterval] = intervalRange
      return (
        Math.floor(Math.random() * (maxInterval - minInterval + 1)) +
        minInterval
      )
    }

    const updateIndex = () => {
      setIndex((prevIndex) => (prevIndex + 1) % frames.length)
    }

    const intervalTime = setRandomInterval()
    const interval = setInterval(() => {
      updateIndex()
    }, intervalTime)

    return () => clearInterval(interval)
  }, [index, frames.length, intervalRange])

  const CurrentFrame = frames[index]

  return <CurrentFrame />
}
