'use client'
import { motion, AnimatePresence } from 'framer-motion'
import useInitialScroll from '@/hooks/use-initial-scroll'

export default function MegaCover() {
  const isAtTop = useInitialScroll()

  return (
    <AnimatePresence>
      {isAtTop && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 0 }}
          className="pointer-events-none fixed z-20 inset-0 hidden md:flex flex-col items-center text-mega justify-center md:justify-between pb-16 p-8"
        >
          <p>Direction</p>
          <p>Design</p>
          <p>Development</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
