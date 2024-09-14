'use client'
import { motion, AnimatePresence } from 'framer-motion'

export default function MegaCover() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 0 }}
        className="pointer-events-none fixed z-20 inset-0 flex flex-col items-center text-mega justify-center md:justify-between pb-16 p-8"
      >
        <p>Direction</p>
        <p>Design</p>
        <p>Development</p>
      </motion.div>
    </AnimatePresence>
  )
}
