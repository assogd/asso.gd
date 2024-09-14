'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

const Announcement = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [50, 100], [1, 0])

  return (
    <motion.div
      className="bg-white border border-black p-4 text-center md:border-0 md:mt-0 md:p-0 md:text-left md:left-16 col-span-full"
      style={{ opacity }} // Bind opacity to the animated value
    >
      We can write something here, like an announcement
    </motion.div>
  )
}

export default Announcement
