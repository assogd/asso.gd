'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LockBody from '@/components/ux/lockBody'

const Loading = () => {
  const [loading, setLoading] = useState(true)
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    'Preparing experience — 23%',
    'Generating euphoria — 46%',
    'Calibrating reality — 69%',
    'Finalizing immersion — 92%'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length)
    }, 1450)

    // Adjusted to match the interval, starting after the first full second
    const timer = setTimeout(() => {
      setLoading(false)
    }, messages.length * 1300)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed -inset-12 p-12 pb-24 bg-black z-50 flex items-center justify-center"
          initial={false}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <LockBody />
          <div className="font-serif text-center text-2xl flex flex-col gap-1 sm:gap-0">
            <span className="uppercase">
              <span className="extra-tracking">Adam Richard</span>s
            </span>
            <span className="text-sm italic">Director of Photography</span>
          </div>
          <div className="absolute bottom-16 inset-x-16 text-center uppercase p-4 m-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={messageIndex}
                initial={{ opacity: 0, translateY: -5 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 5 }}
                transition={{ duration: 0.5 }}
                className="inline-block py-2"
              >
                {messages[messageIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Loading
