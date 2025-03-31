'use client'
import { useRef, useEffect, useState, useMemo } from 'react'
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
      className={clipPathCompatible ? '' : 'relative z-10'}
      {...(clipPathCompatible ? clipProps : fadeProps)}
    >
      {children}
    </MotionComponent>
  )
}
