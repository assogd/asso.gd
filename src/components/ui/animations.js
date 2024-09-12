'use client'
import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'

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
  isReady
}) => {
  const MotionComponent = motion[as] || motion.div
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <MotionComponent
      ref={ref}
      initial={{ clipPath: 'inset(0 0 100% 0)' }} // Start fully hidden (from the bottom)
      animate={isInView && isReady ? { clipPath: 'inset(0% 0 0 0)' } : {}} // Reveal from bottom to top
      transition={{ duration: 2, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </MotionComponent>
  )
}
