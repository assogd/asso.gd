'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import clsx from 'clsx'
import { useRef, useEffect } from 'react'

export const DisappearOnScroll = ({ children, className }) => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [100, 800], [0, 400]) // Adjust the range as needed
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.7])
  const rotateX = useTransform(scrollY, [0, 400], [0, -25]) // Adjust the range and values as needed

  return (
    <motion.div
      className={clsx(className, 'origin-bottom')}
      style={{
        y,
        opacity,
        scale,
        rotateX,
        transformPerspective: 1000
      }}
    >
      {children}
    </motion.div>
  )
}

export const Main = ({ children, className }) => {
  return (
    <main
      className={clsx(
        'grid grid-cols-12 gap-x-4 gap-y-8 md:gap-y-4',
        className
      )}
    >
      {children}
    </main>
  )
}
