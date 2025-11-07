'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import clsx from 'clsx'

export const FadeInOnLoad = ({ children, className = '', as = 'div' }) => {
  const MotionComponent = motion[as] || motion.div

  return (
    <MotionComponent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}

export const UncoverWhenInView = ({
  children,
  className = '',
  as = 'div',
  isReady,
  clipPathCompatible
}) => {
  const MotionComponent = motion[as] || motion.div
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const isVisible = isInView && isReady

  const clipProps = {
    initial: { clipPath: 'inset(0% 0% 100% 0%)' },
    animate: isVisible ? { clipPath: 'inset(0% 0% 0% 0%)' } : {},
    transition: { duration: 1.2, ease: 'easeOut' }
  }

  const fadeProps = {
    initial: { opacity: 0 },
    animate: isVisible ? { opacity: 1 } : {},
    transition: { duration: 0, ease: 'easeOut' }
  }

  return (
    <MotionComponent
      ref={ref}
      className={(clipPathCompatible ? '' : 'relative z-10', className)}
      {...(clipPathCompatible ? clipProps : fadeProps)}
    >
      {children}
    </MotionComponent>
  )
}

export const OpacityBlink = ({
  children,
  className = '',
  as = 'div',
  duration = 1, // seconds for each state (opacity 1 and opacity 0)
  hoverOnly = false
}) => {
  const MotionComponent = motion[as] || motion.div
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  // Start blinking when component mounts (or on hover if hoverOnly)
  useEffect(() => {
    const shouldBlink = hoverOnly ? isHovered : true

    if (shouldBlink) {
      // Start with opacity 1
      setIsVisible(true)

      // Set up interval to toggle between states
      intervalRef.current = setInterval(() => {
        setIsVisible((prev) => !prev)
      }, duration * 1000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      // Reset to opacity 0 when not hovering
      setIsVisible(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [duration, hoverOnly, isHovered])

  return (
    <MotionComponent
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0 }}
      onHoverStart={() => hoverOnly && setIsHovered(true)}
      onHoverEnd={() => hoverOnly && setIsHovered(false)}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}

export const AlternatingCharactersColorBlink = ({
  text,
  duration = 1,
  className = '',
  activeClass = 'text-current',
  inactiveClass = 'text-red'
}) => {
  const [isBlinking, setIsBlinking] = useState(true)

  // Toggle `isBlinking` every duration seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking((prev) => !prev)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <>
      {[...text].map((char, charIndex) => (
        <span
          key={charIndex}
          className={clsx(
            className,
            isBlinking
              ? charIndex % 2 === 0
                ? activeClass
                : inactiveClass
              : charIndex % 2 === 0
                ? inactiveClass
                : activeClass
          )}
        >
          {char}
        </span>
      ))}
    </>
  )
}
