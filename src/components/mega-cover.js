'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { useMegaCover } from '@/components/mega-cover-context'
import useInitialScroll from '@/hooks/use-initial-scroll'
import { useMedia } from 'use-media'

export default function MegaCover() {
  const { hasRun, setHasRun } = useMegaCover()
  const isAtTop = useInitialScroll() // Existing hook to check if at the top
  const isMobile = useMedia({ maxWidth: 767 })

  useEffect(() => {
    if (!isAtTop || isMobile) {
      setHasRun(true) // Skip animation if not at the top or on mobile
    }
  }, [isAtTop, isMobile, setHasRun])

  if (!isAtTop || isMobile || hasRun) return null // Do not render under these conditions

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 0 }}
        className="pointer-events-none fixed z-20 inset-0 flex flex-col items-center text-mega justify-center md:justify-between pb-16 p-8"
        onAnimationComplete={() => setHasRun(true)} // Mark as run after animation
      >
        <p>Direction</p>
        <p>Design</p>
        <p>Development</p>
      </motion.div>
    </AnimatePresence>
  )
}
