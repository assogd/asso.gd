'use client'

import { useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'framer-motion'

// Maximum tilt in degrees at the edge of the input range.
const MAX_TILT = 10
// Device tilt (degrees from the neutral pose) that maps to full tilt.
const GYRO_RANGE = 25
const SPRING = { stiffness: 120, damping: 18, mass: 0.6 }

function clamp(value) {
  return Math.max(-1, Math.min(1, value))
}

/**
 * Tilts its children toward the cursor (desktop) or the device tilt (gyro).
 * Pointing at the bottom right tips the image toward the bottom right.
 * Gyro takes over once the device reports orientation data; the first
 * reading is used as the neutral pose. Disabled for reduced-motion users.
 */
export function TiltFrame({ children, className }) {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, SPRING)
  const smoothY = useSpring(y, SPRING)
  // Cursor right -> right edge moves away (positive rotateY).
  // Cursor low -> bottom edge moves away (negative rotateX).
  const rotateY = useTransform(smoothX, (v) => v * MAX_TILT)
  const rotateX = useTransform(smoothY, (v) => v * -MAX_TILT)

  useEffect(() => {
    if (reduceMotion) return

    let usingGyro = false
    let baseline = null
    let gyroAttached = false

    function onPointerMove(event) {
      if (usingGyro || event.pointerType === 'touch') return
      x.set(clamp((event.clientX / window.innerWidth) * 2 - 1))
      y.set(clamp((event.clientY / window.innerHeight) * 2 - 1))
    }

    function onOrientation(event) {
      if (event.gamma == null || event.beta == null) return
      usingGyro = true
      if (!baseline) baseline = { gamma: event.gamma, beta: event.beta }
      x.set(clamp((event.gamma - baseline.gamma) / GYRO_RANGE))
      y.set(clamp((event.beta - baseline.beta) / GYRO_RANGE))
    }

    function attachGyro() {
      if (gyroAttached) return
      gyroAttached = true
      window.addEventListener('deviceorientation', onOrientation)
    }

    function requestGyro() {
      window.removeEventListener('pointerup', requestGyro)
      DeviceOrientationEvent.requestPermission()
        .then((state) => {
          if (state === 'granted') attachGyro()
        })
        .catch(() => {})
    }

    window.addEventListener('pointermove', onPointerMove)

    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS: permission must be requested from a user gesture.
        window.addEventListener('pointerup', requestGyro)
      } else {
        attachGyro()
      }
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', requestGyro)
      window.removeEventListener('deviceorientation', onOrientation)
    }
  }, [reduceMotion, x, y])

  return (
    <motion.div
      className={className}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000 }
      }
    >
      {children}
    </motion.div>
  )
}
